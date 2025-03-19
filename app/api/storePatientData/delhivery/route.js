import { promises as fs } from "fs";
import { resolve } from "path";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.json();
    console.log("📥 Received patient data:", JSON.stringify(data, null, 2));

    // ✅ Validate input
    const name = data.name?.trim();
    const age = data.age?.trim();
    const address = data.address?.trim();
    const issue = data.issue?.trim();
    const contact = data.contact?.trim();
    const doctor = data.doctor?.trim();

    if (!name || !age || !address || !issue || !contact || !doctor) {
      console.warn("⚠️ Missing required fields:", { name, age, address, issue, contact, doctor });
      return NextResponse.json({ error: "All fields are required!" }, { status: 400 });
    }

    // ✅ Define the correct file path
    const filePath = "C:\\Users\\varsh\\OneDrive\\QEYfOzlKaf\\AIDOC+\\ai_doc\\admin\\homed.txt";

    // ✅ Prepare formatted data
    const patientInfo = `
📅 Time: ${new Date().toLocaleString()}
👤 Name: ${name}
🎂 Age: ${age}
🏠 Address: ${address}
🩺 Issue: ${issue}
📞 Contact: ${contact}
🏥 Doctor: ${doctor}
------------------------------`;

    // ✅ Append data to file
    try {
      await fs.appendFile(filePath, patientInfo, "utf8");
      console.log("✅ Patient data saved to:", filePath);
    } catch (writeError) {
      console.error("❌ Error writing to file:", writeError);
      return NextResponse.json({ error: "Failed to save booking data." }, { status: 500 });
    }

    return NextResponse.json({ message: "✅ Appointment booked successfully!" }, { status: 200 });

  } catch (error) {
    console.error("❌ Server error:", error);
    return NextResponse.json({ error: "Internal server error. Please try again." }, { status: 500 });
  }
}
