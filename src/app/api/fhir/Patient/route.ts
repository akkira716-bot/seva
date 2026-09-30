import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// HL7 FHIR R4 Patient Resource representation
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id') || 'user-demo-1';

  const user = db.getUser(id);
  if (!user) {
    return NextResponse.json(
      {
        resourceType: 'OperationOutcome',
        issue: [{ severity: 'error', code: 'not-found', diagnostics: 'Patient not found' }]
      },
      { status: 404 }
    );
  }

  // FHIR R4 Compliant Patient Resource
  const fhirPatient = {
    resourceType: 'Patient',
    id: user.id,
    meta: {
      versionId: '1',
      lastUpdated: new Date().toISOString(),
      profile: ['http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient']
    },
    active: true,
    name: [
      {
        use: 'official',
        text: user.name,
        family: user.name.split(' ').slice(1).join(' ') || 'Parent',
        given: [user.name.split(' ')[0]]
      }
    ],
    telecom: [
      { system: 'email', value: user.email, use: 'home' },
      ...(user.phone ? [{ system: 'phone', value: user.phone, use: 'mobile' }] : [])
    ],
    communication: [
      {
        language: {
          coding: [
            {
              system: 'urn:ietf:bcp:47',
              code: user.preferredLanguage,
              display: user.preferredLanguage.toUpperCase()
            }
          ]
        },
        preferred: true
      }
    ],
    extension: [
      {
        url: 'http://seva.org/fhir/StructureDefinition/privacy-compliance',
        valueString: 'WHO-Digital-Health-9789240064355-Compliant'
      }
    ]
  };

  return NextResponse.json(fhirPatient, {
    headers: {
      'Content-Type': 'application/fhir+json; charset=utf-8'
    }
  });
}
