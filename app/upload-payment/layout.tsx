import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Subir Comprobante de Pago - Forma App',
  description: 'Sube tu comprobante SINPE para activar tu membresía de gimnasio',
};

export default function UploadPaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}