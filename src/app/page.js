import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BookOpen, Calendar, PlayCircle, School } from "lucide-react"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* MAIN CONTENT */}
      <main className="flex-1">

        {/* HERO SECTION */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Never Miss a Lesson Again!
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-gray-500 md:text-xl dark:text-gray-400">
              Seamless online access to recorded lessons & teacher notes tailored for your learning journey.
            </p>
            <div className="mt-6 space-x-4 flex-col items-center ">
              <Link href={"/login"}>
                <Button>Login & Start Learning</Button>
              </Link>
              <p className="text-sm text-gray-500 mt-3">
                No signup required—just log in with Google and start learning instantly!
              </p>
            </div>
          </div>
        </section>

        {/* KEY FEATURES SECTION */}
        <section className="bg-gray-100 dark:bg-gray-800 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Why TuitionLMS?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PlayCircle className="w-6 h-6" />
                    <span>Lesson Replays</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Missed a class? Watch recorded lessons anytime, anywhere.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-6 h-6" />
                    <span>Teacher Notes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Structured, easy-to-understand notes for revision.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-6 h-6" />
                    <span>Progress Tracking</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Students can mark lessons as completed and stay on track.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <School className="w-6 h-6" />
                    <span>Tuition Centers</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Expand your services with online learning & recorded sessions.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              How It Works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { "step": 1, "text": "Students access their dashboard upon logging in." },
                { "step": 2, "text": "View video lessons and study notes with a completion tracking feature." },
                { "step": 3, "text": "Teachers monitor student progress effectively." },
                { "step": 4, "text": "Teachers efficiently upload and manage lesson materials." },  
              ].map((item) => (
                <div key={item.step} className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
                    {item.step}
                  </div>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US SECTION */}
        <section className="bg-gray-100 dark:bg-gray-800 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              The Best LMS for Tuition Centers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "Boost Student Engagement", description: "Let students catch up on lessons at their own pace." },
                { title: "Easy Lesson Management", description: "Teachers can upload videos & notes in minutes." },
                { title: "Expand Your Tuition Business", description: "Offer online learning & attract more students." },
                { title: "Custom Branding", description: "Your logo, colors, and domain – fully personalized." },
              ].map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CALL TO ACTION SECTION */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Give Your Students the Best Learning Experience
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-gray-500 md:text-xl dark:text-gray-400">
                Start today and take your tuition center online. Let students learn without limits.
              </p>
              <div className="mt-6">
                <Link href={"/login"}>
                  <Button>
                    Start Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </div>
  )
}
