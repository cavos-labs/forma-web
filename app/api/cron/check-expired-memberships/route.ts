import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Check if a date has expired with optional tolerance days
function isExpired(dateString: string, toleranceDays: number = 0): boolean {
  const endDate = new Date(dateString);
  const today = new Date();

  // Reset hours to compare only dates
  today.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  // Calculate difference in days
  const diffTime = today.getTime() - endDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > toleranceDays;
}

export async function POST(request: NextRequest) {
  try {
    // Verify authorization using CRON_SECRET environment variable
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(
      `[${new Date().toISOString()}] Starting daily membership expiration check...`
    );

    // Fetch all active memberships that might have expired
    const { data: activeMemberships, error: fetchError } = await supabaseAdmin
      .from("memberships")
      .select(
        `
        id,
        user_id,
        gym_id,
        status,
        end_date,
        grace_period_end,
        monthly_fee,
        users (
          email,
          first_name,
          last_name
        ),
        gyms (
          name
        )
      `
      )
      .eq("status", "active")
      .not("end_date", "is", null);

    if (fetchError) {
      console.error("Error fetching memberships:", fetchError);
      return NextResponse.json(
        { error: "Error fetching memberships" },
        { status: 500 }
      );
    }

    if (!activeMemberships || activeMemberships.length === 0) {
      console.log("No active memberships to check");
      return NextResponse.json({
        success: true,
        message: "No active memberships to check",
        processed: 0,
        expired: 0,
      });
    }

    // Initialize counters for tracking processed memberships
    let expiredCount = 0;
    let processedCount = 0;
    let inactiveCount = 0;
    const results = [];

    // Process each active membership to check for expiration
    for (const membership of activeMemberships) {
      processedCount++;

      if (!membership.end_date) continue;

      // Check if membership has expired (with 1 day tolerance)
      if (isExpired(membership.end_date, 1)) {
        try {
          // Update membership status to 'expired'
          const { error: updateError } = await supabaseAdmin
            .from("memberships")
            .update({
              status: "expired",
              updated_at: new Date().toISOString(),
            })
            .eq("id", membership.id);

          if (updateError) {
            console.error(
              `Error updating membership ${membership.id}:`,
              updateError
            );
            results.push({
              id: membership.id,
              status: "error",
              message: "Error updating status",
            });
            continue;
          }

          // Create notification for the user about expired membership
          const { error: notificationError } = await supabaseAdmin
            .from("notifications")
            .insert({
              user_id: membership.user_id,
              membership_id: membership.id,
              type: "membership_expired",
              title: "Membresía Expirada",
              message: `Tu membresía en ${
                (membership.gyms as any)?.name || "el gimnasio"
              } ha expirado. Por favor, renueva tu pago para continuar accediendo.`,
              status: "pending",
              scheduled_for: new Date().toISOString(),
            });

          if (notificationError) {
            console.error(
              `Error creating notification for membership ${membership.id}:`,
              notificationError
            );
          }

          expiredCount++;
          results.push({
            id: membership.id,
            user: `${(membership.users as any)?.first_name || ""} ${
              (membership.users as any)?.last_name || ""
            }`,
            email: (membership.users as any)?.email || "sin email",
            gym: (membership.gyms as any)?.name || "sin nombre",
            end_date: membership.end_date,
            status: "expired",
            message: "Membership marked as expired",
          });

          console.log(
            `Membership ${membership.id} marked as expired for ${
              (membership.users as any)?.email || "sin email"
            }`
          );
        } catch (error) {
          console.error(`Error processing membership ${membership.id}:`, error);
          results.push({
            id: membership.id,
            status: "error",
            message: "Error in processing",
          });
        }
      }
    }

    // Check expired memberships that have passed their grace period
    const { data: expiredMemberships, error: expiredFetchError } =
      await supabaseAdmin
        .from("memberships")
        .select(
          `
        id,
        user_id,
        gym_id,
        status,
        end_date,
        grace_period_end,
        users (
          email,
          first_name,
          last_name
        ),
        gyms (
          name
        )
      `
        )
        .eq("status", "expired")
        .not("grace_period_end", "is", null);

    console.log("expiredMemberships", expiredMemberships);

    if (!expiredFetchError && expiredMemberships) {
      for (const membership of expiredMemberships) {
        if (!membership.grace_period_end) continue;

        // If grace period has expired, change status to 'inactive'
        if (isExpired(membership.grace_period_end, 0)) {
          try {
            const { error: updateError } = await supabaseAdmin
              .from("memberships")
              .update({
                status: "inactive",
                updated_at: new Date().toISOString(),
              })
              .eq("id", membership.id);

            if (!updateError) {
              inactiveCount++;

              console.log(
                `Membership ${membership.id} changed to inactive (grace period expired)`
              );

              console.log(
                `Membership ${membership.id} changed to inactive for ${
                  (membership.users as any)?.email || "sin email"
                } in ${
                  (membership.gyms as any)?.name || "sin nombre"
                } - Grace period expired on ${membership.grace_period_end}`
              );

              // Add to results array for tracking
              results.push({
                id: membership.id,
                user: `${(membership.users as any)?.first_name || ""} ${
                  (membership.users as any)?.last_name || ""
                }`,
                email: (membership.users as any)?.email || "sin email",
                gym: (membership.gyms as any)?.name || "sin nombre",
                grace_period_end: membership.grace_period_end,
                status: "inactive",
                message:
                  "Membership changed to inactive (grace period expired)",
              });

              // Create notification about grace period ending
              await supabaseAdmin.from("notifications").insert({
                user_id: membership.user_id,
                membership_id: membership.id,
                type: "grace_period_ending",
                title: "Período de Gracia Expirado",
                message: `Tu período de gracia en ${
                  (membership.gyms as any)?.name || "el gimnasio"
                } ha expirado. Tu membresía ahora está inactiva.`,
                status: "pending",
                scheduled_for: new Date().toISOString(),
              });
            }
          } catch (error) {
            console.error(
              `Error changing membership ${membership.id} to inactive:`,
              error
            );
          }
        }
      }
    }

    // Log final summary of processed memberships
    console.log(
      `[${new Date().toISOString()}] Check completed. Processed: ${processedCount}, Expired: ${expiredCount}, Inactive: ${inactiveCount}`
    );

    return NextResponse.json({
      success: true,
      message: "Daily verification completed",
      processed: processedCount,
      expired: expiredCount,
      inactive: inactiveCount,
      results: results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in verification job:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
