import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma'; 
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    // 1. Isang beses lang natin i-hash ang password para mabilis ang loading
    // Lahat ng doktor ay magkakaroon ng default password na 'doctor123'
    const hashedPassword = await bcrypt.hash('doctor123', 10);

    // 2. Ito ang buong listahan ng mga doktor, departments, at specialties
    const doctorsList = [
      { fName: 'Juan', lName: 'Dela Cruz', email: 'juan@pgh.com', dept: 'Ophthalmology', desc: 'Eye and vision care', specialty: 'General Ophthalmologist', lic: 'MD-10001' },
      { fName: 'Ana', lName: 'Reyes', email: 'ana@pgh.com', dept: 'Dermatology', desc: 'Skin, hair, and nail care', specialty: 'Clinical Dermatologist', lic: 'MD-10002' },
      { fName: 'Carlos', lName: 'Mendoza', email: 'carlos@pgh.com', dept: 'Neurology', desc: 'Brain and nervous system', specialty: 'Neurologist', lic: 'MD-10003' },
      { fName: 'Leni', lName: 'Santos', email: 'leni@pgh.com', dept: 'Psychiatry', desc: 'Mental health care', specialty: 'Psychiatrist', lic: 'MD-10004' },
      { fName: 'Elena', lName: 'Gomez', email: 'elena@pgh.com', dept: 'Pulmonology', desc: 'Lungs and respiratory care', specialty: 'Pulmonologist', lic: 'MD-10005' },
      { fName: 'Mark', lName: 'Bautista', email: 'mark@pgh.com', dept: 'Gastroenterology', desc: 'Digestive system care', specialty: 'Gastroenterologist', lic: 'MD-10006' },
      { fName: 'Roberto', lName: 'Villanueva', email: 'roberto@pgh.com', dept: 'Orthopedics', desc: 'Bones and joints care', specialty: 'Orthopedic Surgeon', lic: 'MD-10007' },
      { fName: 'Patricia', lName: 'Lim', email: 'patricia@pgh.com', dept: 'ENT', desc: 'Ear, Nose, and Throat', specialty: 'ENT Specialist', lic: 'MD-10008' },
      { fName: 'Fernando', lName: 'Cruz', email: 'fernando@pgh.com', dept: 'Nephrology', desc: 'Kidney care', specialty: 'Nephrologist', lic: 'MD-10009' },
      { fName: 'Jose', lName: 'Garcia', email: 'jose@pgh.com', dept: 'Urology', desc: 'Urinary tract care', specialty: 'Urologist', lic: 'MD-10010' },
      { fName: 'Teresa', lName: 'Aguilar', email: 'teresa@pgh.com', dept: 'OB-GYN', desc: 'Women\'s health and pregnancy', specialty: 'Obstetrician-Gynecologist', lic: 'MD-10011' },
      { fName: 'Sofia', lName: 'Torres', email: 'sofia@pgh.com', dept: 'Endocrinology', desc: 'Hormones and metabolism', specialty: 'Endocrinologist', lic: 'MD-10012' },
      { fName: 'Ricardo', lName: 'Castro', email: 'ricardo@pgh.com', dept: 'Hematology', desc: 'Blood disorders', specialty: 'Hematologist', lic: 'MD-10013' },
      { fName: 'Mikaela', lName: 'Fernandez', email: 'mikaela@pgh.com', dept: 'Pediatrics', desc: 'Child and infant care', specialty: 'Pediatrician', lic: 'MD-10014' },
      { fName: 'Gabriel', lName: 'Ramos', email: 'gabriel@pgh.com', dept: 'Internal Medicine', desc: 'General adult care', specialty: 'Internal Medicine Physician', lic: 'MD-10015' }
    ];

    // 3. I-loop natin sila isa-isa gamit ang iyong Upsert Logic
    for (const doc of doctorsList) {
      
      // A. Gumawa ng Department
      const dept = await prisma.department.upsert({
        where: { name: doc.dept },
        update: {},
        create: {
          name: doc.dept,
          description: doc.desc,
        },
      });

      // B. Gumawa ng User account para sa Doctor
      const userDoc = await prisma.user.upsert({
        where: { email: doc.email },
        update: {},
        create: {
          email: doc.email,
          passwordHash: hashedPassword,
          firstName: doc.fName,
          lastName: doc.lName,
          role: 'DOCTOR' as any,
        },
      });

      // C. Ikonekta ang User account sa Doctor table at Department table
      await prisma.doctor.upsert({
        where: { userId: userDoc.id },
        update: {},
        create: {
          userId: userDoc.id,
          specialty: doc.specialty,
          departmentId: dept.id,
          licenseNumber: doc.lic,
        },
      });
    }

    return NextResponse.json({ 
      message: 'Success! Lahat ng 15 Doctors at Departments ay nai-add na sa Database.' 
    });

  } catch (error: any) {
    return NextResponse.json({ error: 'May error: ' + error.message }, { status: 500 });
  }
}