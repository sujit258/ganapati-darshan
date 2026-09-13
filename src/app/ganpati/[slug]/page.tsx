import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { GANPATIS } from '@/data/ganpatis';
import GanpatiDetailClient from './GanpatiDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return GANPATIS.map((ganpati) => ({
    slug: ganpati.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ganpati = GANPATIS.find((g) => g.slug === slug);

  if (!ganpati) {
    return {
      title: 'गणपती माहिती सापडली नाही | पुणे गणपती दर्शन',
    };
  }

  return {
    title: `${ganpati.name} - इतिहास, महत्त्व व दिशा | पुणे गणपती दर्शन`,
    description: `${ganpati.name} (${ganpati.categoryLabel}) - ${ganpati.description} स्थापना वर्ष: ${ganpati.establishedYear}. पत्ता व दिशा मिळवा.`,
    openGraph: {
      title: `${ganpati.name} | पुणे गणपती दर्शन`,
      description: ganpati.description,
      images: [ganpati.image],
    },
  };
}

export default async function GanpatiDetailPage({ params }: Props) {
  const { slug } = await params;
  const ganpati = GANPATIS.find((g) => g.slug === slug);

  if (!ganpati) {
    notFound();
  }

  return <GanpatiDetailClient ganpati={ganpati} />;
}
