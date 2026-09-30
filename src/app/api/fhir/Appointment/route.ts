import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// HL7 FHIR R4 Appointment Resource representation
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get('patient') || 'user-demo-1';

  const appointments = db.getAppointments(patientId);

  // FHIR R4 Bundle containing Appointment resources
  const fhirBundle = {
    resourceType: 'Bundle',
    type: 'searchset',
    total: appointments.length,
    entry: appointments.map(appt => ({
      fullUrl: `http://seva.org/fhir/Appointment/${appt.id}`,
      resource: {
        resourceType: 'Appointment',
        id: appt.id,
        status: appt.status === 'scheduled' ? 'booked' : appt.status,
        description: appt.title,
        start: appt.dateTime,
        created: appt.createdAt,
        participant: [
          {
            actor: {
              reference: `Patient/${appt.userId}`,
              display: 'Mother / Parent'
            },
            status: 'accepted'
          },
          ...(appt.providerName ? [{
            actor: {
              reference: `Practitioner/${appt.providerId || 'prov-ref'}`,
              display: appt.providerName
            },
            status: 'accepted'
          }] : [])
        ],
        serviceType: [
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/service-type',
                code: '124',
                display: 'Maternal & Child Health'
              }
            ]
          }
        ]
      }
    }))
  };

  return NextResponse.json(fhirBundle, {
    headers: {
      'Content-Type': 'application/fhir+json; charset=utf-8'
    }
  });
}
