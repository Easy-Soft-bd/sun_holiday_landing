
export interface VisaRequirement {
    title: string;
    items: string[];
}

export interface VisaService {
    id: string;
    country: string;
    flag: string;
    image: string;
    category: 'Tourist' | 'Business' | 'Transit' | 'Student';
    processingTime: string;
    validity: string;
    price: number;
    description: string;
    requirements: VisaRequirement[];
}

export const visaServices: VisaService[] = [
    {
        id: '1',
        country: 'United Arab Emirates',
        flag: '🇦🇪',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop',
        category: 'Tourist',
        processingTime: '3-5 Working Days',
        validity: '30 Days / 60 Days',
        price: 12500,
        description: 'Explore the wonders of Dubai and Abu Dhabi with our hassle-free UAE tourist visa service.',
        requirements: [
            {
                title: 'Basic Documents',
                items: ['Passport copy (6 months validity)', 'Recent passport size photo', 'NID/Birth Certificate copy']
            }
        ]
    },
    {
        id: '2',
        country: 'United Kingdom',
        flag: '🇬🇧',
        image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop',
        category: 'Tourist',
        processingTime: '15-20 Working Days',
        validity: '6 Months (Standard)',
        price: 18500,
        description: 'Expert guidance for your UK Standard Visitor Visa application from Bangladesh.',
        requirements: [
            {
                title: 'Financial Documents',
                items: ['Bank statement (6 months)', 'Solvency certificate', 'Income tax returns']
            },
            {
                title: 'Professional Documents',
                items: ['NOC from employer', 'Trade license for business owners', 'Student ID/Certificate']
            }
        ]
    },
    {
        id: '3',
        country: 'Turkey',
        flag: '🇹🇷',
        image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=2070&auto=format&fit=crop',
        category: 'Tourist',
        processingTime: '7-10 Working Days',
        validity: '90 Days',
        price: 14500,
        description: 'Discover the bridge between Europe and Asia. We provide complete Turkey sticker visa assistance.',
        requirements: [
            {
                title: 'Mandatory',
                items: ['Original Passport', 'Health insurance', 'Biometric photos', 'Flight & Hotel booking']
            }
        ]
    },
    {
        id: '4',
        country: 'Thailand',
        flag: '🇹🇭',
        image: 'https://images.unsplash.com/photo-1626018517488-5b64242cfa75?q=80&w=2070&auto=format&fit=crop',
        category: 'Tourist',
        processingTime: '5-7 Working Days',
        validity: '3 Months / 6 Months',
        price: 5500,
        description: 'Enjoy the tropical beaches of Thailand. Quick and reliable visa processing for Bangladeshi citizens.',
        requirements: [
            {
                title: 'Documents',
                items: ['Passport', 'Photos (3.5x4.5cm)', 'Bank statement', 'NOC/Trade License']
            }
        ]
    },
    {
        id: '5',
        country: 'Saudi Arabia',
        flag: '🇸🇦',
        image: 'https://images.unsplash.com/photo-1720549973451-018d3623b55a?q=80&w=2070&auto=format&fit=crop',
        category: 'Tourist',
        processingTime: '2-4 Working Days',
        validity: '1 Year (Multiple Entry)',
        price: 15500,
        description: 'Saudi Tourist/Umrah visa for exploration and pilgrimage. Fast E-visa processing.',
        requirements: [
            {
                title: 'E-visa Reqs',
                items: ['Scan copy of Passport', 'Digital photo', 'Email address']
            }
        ]
    },
    {
        id: '6',
        country: 'Singapore',
        flag: '🇸🇬',
        image: 'https://images.unsplash.com/photo-1525625293386-3fb0ad7c1fd6?q=80&w=2070&auto=format&fit=crop',
        category: 'Tourist',
        processingTime: '5-7 Working Days',
        validity: '35 Days / 2 Years',
        price: 6500,
        description: 'Visit the Lion City. We handle Singapore visa applications with complete documentation support.',
        requirements: [
            {
                title: 'Documents',
                items: ['Passport', 'Photo (White background)', 'Bank Statement', 'LOI (if applicable)']
            }
        ]
    }
];
