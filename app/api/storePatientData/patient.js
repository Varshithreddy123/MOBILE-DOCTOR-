import { promises as fs } from "fs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.json();
    console.log("📥 Received appointment data:", JSON.stringify(data, null, 2));

    // ✅ Validate input
    const name = data.name?.trim();
    const age = data.age?.trim();
    const issue = data.issue?.trim();
    const doctor = data.doctor?.trim();

    if (!name || !age || !issue || !doctor) {
      console.warn("⚠️ Missing required fields:", { name, age, issue, doctor });
      return NextResponse.json({ error: "All fields are required!" }, { status: 400 });
    }

    // ✅ Define the correct file path
    const filePath = "C:\\Users\\varsh\\OneDrive\\QEYfOzlKaf\\AIDOC+\\ai_doc\\admin\\patients.txt";

    // ✅ Prepare formatted data
    const appointmentInfo = `
📅 Time: ${new Date().toLocaleString()}
👤 Name: ${name}
🎂 Age: ${age}
🩺 Issue: ${issue}
🏥 Doctor: ${doctor}
------------------------------`;

    // ✅ Append data to file
    try {
      await fs.appendFile(filePath, appointmentInfo, "utf8");
      console.log("✅ Doctor appointment data saved to:", filePath);
    } catch (writeError) {
      console.error("❌ Error writing to file:", writeError);
      return NextResponse.json({ error: "Failed to save appointment data." }, { status: 500 });
    }

    return NextResponse.json({ message: "✅ Doctor appointment booked successfully!" }, { status: 200 });

  } catch (error) {
    console.error("❌ Server error:", error);
    return NextResponse.json({ error: "Internal server error. Please try again." }, { status: 500 });
  }
}
