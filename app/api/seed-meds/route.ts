import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma'; 

export async function GET() {
  try {
    const medsList = [
      // Ophthalmology
      { name: "Tobramycin (Eye Drops)", category: "Ophthalmology", dosage: "1 to 2 drops", instructions: "Apply to the affected eye(s) every 4 hours for 7 days." },
      { name: "Ketorolac (Eye Drops)", category: "Ophthalmology", dosage: "1 drop", instructions: "Apply 1 drop to the affected eye 4 times a day for itchiness/pain." },
      { name: "Latanoprost (Eye Drops)", category: "Ophthalmology", dosage: "1 drop", instructions: "Apply 1 drop to the affected eye(s) once daily in the evening for Glaucoma." },
      { name: "Systane Ultra (Lubricating Eye Drops)", category: "Ophthalmology", dosage: "1 to 2 drops", instructions: "Instill 1 or 2 drops in the affected eye(s) as needed for dry eyes." },
      
      // Cardiology
      { name: "Amlodipine", category: "Cardiology", dosage: "5mg", instructions: "Take 1 tablet daily, preferably at the same time each day for hypertension." },
      { name: "Losartan", category: "Cardiology", dosage: "50mg", instructions: "Take 1 tablet once a day to manage high blood pressure." },
      { name: "Atorvastatin", category: "Cardiology", dosage: "20mg", instructions: "Take 1 tablet once daily in the evening to lower cholesterol." },
      { name: "Clopidogrel", category: "Cardiology", dosage: "75mg", instructions: "Take 1 tablet once a day to prevent blood clots." },

      // Pulmonology
      { name: "Salbutamol (Nebule)", category: "Pulmonology", dosage: "2.5mg / 2.5mL", instructions: "Nebulize every 6 hours as needed for asthma attacks." },
      { name: "Montelukast", category: "Pulmonology", dosage: "10mg", instructions: "Take 1 tablet daily in the evening for asthma maintenance." },
      { name: "Seretide (Salmeterol/Fluticasone)", category: "Pulmonology", dosage: "1 inhalation", instructions: "Inhale twice daily. Gargle with water and spit after each use." },
      { name: "Erdosteine", category: "Pulmonology", dosage: "300mg", instructions: "Take 1 capsule twice a day for severe cough with phlegm." },

      // Dermatology
      { name: "Hydrocortisone Cream 1%", category: "Dermatology", dosage: "Apply thinly", instructions: "Apply a thin layer to the affected skin area 2 times a day." },
      { name: "Ketoconazole Cream", category: "Dermatology", dosage: "Apply twice daily", instructions: "Apply to the affected area for fungal infection." },
      { name: "Mupirocin Ointment", category: "Dermatology", dosage: "Apply 3 times a day", instructions: "Apply a small amount to the affected area 3 times daily." },
      
      // Gastroenterology
      { name: "Omeprazole", category: "Gastroenterology", dosage: "40mg", instructions: "Take 1 capsule once a day, 30 minutes before breakfast for acid reflux." },
      { name: "Domperidone", category: "Gastroenterology", dosage: "10mg", instructions: "Take 1 tablet 3 times a day, 15 minutes before meals for nausea." },
      { name: "Loperamide", category: "Gastroenterology", dosage: "2mg", instructions: "Take 2 capsules immediately, then 1 capsule after every loose bowel movement." },
      
      // ENT
      { name: "Co-Amoxiclav", category: "ENT", dosage: "625mg", instructions: "Take 1 tablet every 12 hours for 7 days. Must finish the course." },
      { name: "Cetirizine", category: "ENT", dosage: "10mg", instructions: "Take 1 tablet once daily, preferably at bedtime, for allergies." },
      
      // General / Internal Medicine
      { name: "Paracetamol (Tablet)", category: "General", dosage: "500mg", instructions: "Take 1 tablet every 4 to 6 hours as needed for fever or pain." },
      { name: "Azithromycin", category: "General", dosage: "500mg", instructions: "Take 1 tablet once a day for 3 days for bacterial infection." },
      { name: "Ibuprofen", category: "General", dosage: "400mg", instructions: "Take 1 tablet every 6 hours as needed for pain. Take with food." },
      { name: "Mefenamic Acid", category: "General", dosage: "500mg", instructions: "Take 1 capsule every 8 hours as needed for severe pain. Take with food." },
      { name: "Cefuroxime", category: "General", dosage: "500mg", instructions: "Take 1 tablet twice a day for 7 days. Finish the entire course." }
    ];

    for (const med of medsList) {
      await prisma.medication.upsert({
        where: { name: med.name },
        update: {},
        create: {
          name: med.name,
          category: med.category,
          defaultDosage: med.dosage,
          defaultInstructions: med.instructions,
        },
      });
    }

    return NextResponse.json({ message: `Success! Added ${medsList.length} medications to the database.` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}