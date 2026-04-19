
import { Metadata } from 'next';
import VisaView from '@/src/view/visa/VisaView';
import { buildPageMetadata } from '@/src/lib/site';

export const metadata: Metadata = buildPageMetadata({
    title: 'Visa Services - Sun Holidays Ltd',
    description: 'Expert visa processing for UK, UAE, Turkey, Kingdom of Saudi Arabia, and many more. Hassle-free documentation and guaranteed delivery.',
    path: '/visa',
});

export default function VisaPage() {
    return <VisaView />;
}
