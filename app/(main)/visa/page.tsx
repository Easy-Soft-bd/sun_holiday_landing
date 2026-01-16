
import { Metadata } from 'next';
import VisaView from '@/src/view/visa/VisaView';

export const metadata: Metadata = {
    title: 'Visa Services - Sun Holidays Ltd',
    description: 'Expert visa processing for UK, UAE, Turkey, Kingdom of Saudi Arabia, and many more. Hassle-free documentation and guaranteed delivery.',
};

export default function VisaPage() {
    return <VisaView />;
}
