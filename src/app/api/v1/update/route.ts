import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { cookieText, site } = await req.json();

    if (site === "quilbot") {
      // Send the request to the Go service
      const response = await axios.post(
        "http://localhost:8080/update-cookie",
        {
          cookieText: cookieText, // Send as JSON object with matching key
        },
        {
          headers: {
            "Content-Type": "application/json", // Set the content type
          },
        }
      );

      if (response.status === 200) {
        return NextResponse.json({
          message: "Update request sent successfully",
          status: 200,
        });
      }

      return NextResponse.json({
        message: "Update request wasn't successful",
        status: 500,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Internal server error", status: 500 });
  }
}
