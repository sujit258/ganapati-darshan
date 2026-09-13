import { Metadata } from 'next';
import DekhaveClient from './DekhaveClient';

export const metadata: Metadata = {
  title: 'गणपतीचे देखावे | पुणे गणपती दर्शन',
  description: 'पुण्यातील गणपती मंडळांचे यंदाचे सुंदर देखावे, मंदिरांच्या प्रतिकृती आणि विशेष सजावट एका ठिकाणी पहा.',
  openGraph: {
    title: 'गणपतीचे देखावे | पुणे गणपती दर्शन',
    description: 'पुण्यातील गणपती मंडळांचे यंदाचे सुंदर देखावे, मंदिरांच्या प्रतिकृती आणि विशेष सजावट एका ठिकाणी पहा.',
    images: [
      {
        url: '/images/dekhave/dagdusheth-prem-mandir.webp',
        width: 1200,
        height: 900,
        alt: 'पुण्यातील गणपतींचे देखावे',
      },
    ],
  },
};

export default function DekhavePage() {
  return <DekhaveClient />;
}
