import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import { createServiceClient } from "@/utils/superbase/server";

export async function GET(request: Request) {
  return NextResponse.json({ message: "Invalid Method" });
  // return NextResponse.json({ message: "success"})
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, postmanCollectionJsonUrl, publishedCourseId, lessonId ,github,reg_no} =
      await req.json();

      if(!name || !email || !postmanCollectionJsonUrl || !publishedCourseId || !lessonId ){
        return NextResponse.json({ message: "Invalid Data" });
      }

    // Construct the data to send in the POST request
    const data = {
      email,
      postmanCollectionJsonUrl,
      publishedCourseId,
      lessonId,
    };

    // Send POST request to the specified URL using Axios
    const response = await axios.post(
      "https://lesson-completion.postmanlabs.com/submit",
      data
    );

    // Check if the response matches the expected output
    if (
      response.data.status === "ok" &&
      response.data.message ===
        "Congratulations! The lesson 'Submit your Postman collection' is now marked as complete."
    ) {
        /*event	
text
string	
postmanCollectionJsonUrl	
text
string	
publishedCourseId	
text
string	
lessonId	
text
string	
created_at	
timestamp with time zone
string	*/
      //insert data to supabase
      const supabase = createServiceClient();
      const { data, error } = await supabase
        .from("PS-experts")
        .insert([{ 
            name:name,
            email,
            reg_no:reg_no,
            github_username:github,
            event: "PSE1",
            postmanCollectionJsonUrl: postmanCollectionJsonUrl,
            publishedCourseId: publishedCourseId,
            lessonId: lessonId,
         }])
        .select();
        console.log(data);
        if (error) {
          console.error(error);
          return NextResponse.json({ message: "Something went wrong" });
        }

      return NextResponse.json({ message: "Congratulations!" });
    } else {
      return NextResponse.json({ message: "Invalid Data" });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "error" });
  }
}
