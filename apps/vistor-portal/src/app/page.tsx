import Image from 'next/image';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Badge,
} from '@musetrip360/ui-core';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M360</span>
              </div>
              <span className="text-xl font-bold text-slate-900">MuseTrip360</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">
                Museums
              </a>
              <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">
                Events
              </a>
              <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">
                Virtual Tours
              </a>
              <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">
                About
              </a>
            </nav>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
              <Button size="sm">Get Started</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Explore Museums Like
              <span className="text-blue-600 block">Never Before</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Discover world-class museums, join exclusive events, and experience immersive 360° virtual tours from the
              comfort of your home or plan your next cultural adventure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8">
                Start Virtual Tour
              </Button>
              <Button variant="outline" size="lg" className="px-8">
                Browse Museums
              </Button>
            </div>
          </div>
        </div>

        {/* Background decorative elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-purple-200 rounded-full opacity-20"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-indigo-200 rounded-full opacity-20"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">250+</div>
              <div className="text-slate-600">Museums</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-slate-600">Artifacts</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-slate-600">Events Monthly</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">1M+</div>
              <div className="text-slate-600">Virtual Visitors</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Museums */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Featured Museums</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Discover our most popular museums featuring world-renowned collections and exhibitions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Museum Card 1 */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
                <Badge className="absolute top-4 left-4 bg-white text-slate-900">Virtual Tour Available</Badge>
              </div>
              <CardHeader>
                <CardTitle>Metropolitan Museum of Art</CardTitle>
                <CardDescription>New York's largest and most comprehensive art museum</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 text-sm text-slate-600 mb-4">
                  <span>🎨 5,000+ Artifacts</span>
                  <span>⭐ 4.9 Rating</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button fullWidth>Explore Museum</Button>
              </CardFooter>
            </Card>

            {/* Museum Card 2 */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-green-500 to-teal-600 relative">
                <Badge className="absolute top-4 left-4 bg-white text-slate-900">New Exhibition</Badge>
              </div>
              <CardHeader>
                <CardTitle>Natural History Museum</CardTitle>
                <CardDescription>Explore the wonders of natural world and human cultures</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 text-sm text-slate-600 mb-4">
                  <span>🦕 3,200+ Specimens</span>
                  <span>⭐ 4.8 Rating</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button fullWidth>Explore Museum</Button>
              </CardFooter>
            </Card>

            {/* Museum Card 3 */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-orange-500 to-red-600 relative">
                <Badge className="absolute top-4 left-4 bg-white text-slate-900">Interactive Experience</Badge>
              </div>
              <CardHeader>
                <CardTitle>Science & Technology Museum</CardTitle>
                <CardDescription>Discover innovations that shaped our modern world</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 text-sm text-slate-600 mb-4">
                  <span>🔬 1,800+ Exhibits</span>
                  <span>⭐ 4.7 Rating</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button fullWidth>Explore Museum</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Upcoming Events</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Join exclusive museum events, workshops, and special exhibitions
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Ancient Civilizations Workshop</CardTitle>
                    <CardDescription>Interactive workshop on ancient Egyptian culture</CardDescription>
                  </div>
                  <Badge>Tomorrow</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-slate-600">
                  <div>📅 March 15, 2024 - 2:00 PM</div>
                  <div>📍 Metropolitan Museum of Art</div>
                  <div>💰 $25 per person</div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="mr-3">
                  Learn More
                </Button>
                <Button>Book Now</Button>
              </CardFooter>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Virtual Reality Dinosaur Experience</CardTitle>
                    <CardDescription>Step into the Jurassic period with VR technology</CardDescription>
                  </div>
                  <Badge>This Weekend</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-slate-600">
                  <div>📅 March 16-17, 2024 - All Day</div>
                  <div>📍 Natural History Museum</div>
                  <div>💰 $35 per person</div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="mr-3">
                  Learn More
                </Button>
                <Button>Book Now</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Virtual Tours CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Experience Museums in 360°</h2>
          <p className="text-xl mb-8 text-blue-100">
            Take immersive virtual tours of world-famous museums from anywhere in the world. High-quality 360°
            experiences with interactive exhibits and expert narration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-blue-50 border-white">
              Start Free Tour
            </Button>
            <Button size="lg" className="bg-blue-500 hover:bg-blue-400">
              Browse All Tours
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M360</span>
                </div>
                <span className="text-xl font-bold text-white">MuseTrip360</span>
              </div>
              <p className="text-slate-400 mb-4">Your gateway to world-class museums and cultural experiences.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Museums</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Browse All
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Art Museums
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    History Museums
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Science Museums
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Features</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Virtual Tours
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Events
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Ticket Booking
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Mobile App
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2024 MuseTrip360. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
