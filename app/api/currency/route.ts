import { NextRequest, NextResponse } from 'next/server';

// Base prices in USD
const BASE_PRICES = {
  monthly: 51,
  yearly: 549
};

// Fallback exchange rate USD to CRC (Costa Rican Colones)
const FALLBACK_USD_TO_CRC_RATE = 520;

async function fetchExchangeRate(): Promise<number> {
  try {
    // Using ExchangeRate-API (free tier, no API key required)
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
      headers: {
        'User-Agent': 'Forma-App/1.0'
      },
      // Cache for 1 hour
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Get CRC rate from the response
    const crcRate = data.rates?.CRC;
    
    if (!crcRate || typeof crcRate !== 'number') {
      throw new Error('CRC rate not found in response');
    }

    return crcRate;
  } catch (error) {
    console.error('Failed to fetch exchange rate:', error);
    
    // Try alternative API as backup
    try {
      const backupResponse = await fetch('https://open.er-api.com/v6/latest/USD', {
        headers: {
          'User-Agent': 'Forma-App/1.0'
        },
        next: { revalidate: 3600 }
      });

      if (backupResponse.ok) {
        const backupData = await backupResponse.json();
        const backupCrcRate = backupData.rates?.CRC;
        
        if (backupCrcRate && typeof backupCrcRate === 'number') {
          return backupCrcRate;
        }
      }
    } catch (backupError) {
      console.error('Backup API also failed:', backupError);
    }
    
    // Return fallback rate if all APIs fail
    return FALLBACK_USD_TO_CRC_RATE;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const currency = searchParams.get('currency') || 'USD';

  try {
    let prices;
    
    if (currency === 'CRC') {
      const exchangeRate = await fetchExchangeRate();
      
      prices = {
        monthly: Math.round(BASE_PRICES.monthly * exchangeRate),
        yearly: Math.round(BASE_PRICES.yearly * exchangeRate),
        currency: 'CRC',
        symbol: '₡',
        exchangeRate: exchangeRate,
        lastUpdated: new Date().toISOString()
      };
    } else {
      prices = {
        monthly: BASE_PRICES.monthly,
        yearly: BASE_PRICES.yearly,
        currency: 'USD',
        symbol: '$',
        exchangeRate: 1,
        lastUpdated: new Date().toISOString()
      };
    }

    return NextResponse.json(prices);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch pricing',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}