import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@musetrip360/ui-core/card';
import { Badge } from '@musetrip360/ui-core/badge';
import { Separator } from '@musetrip360/ui-core/separator';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Star,
  ArrowRight,
  Menu,
  Search,
  Globe,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Globe className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">MuseTrip360</h1>
              <p className="text-xs text-muted-foreground">Digital Museum Platform</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Museums
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Events
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Virtual Tours
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-4 w-4" />
            </Button>
            <Button>Get Started</Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 md:py-32">
          <div className="container relative z-10 mx-auto max-w-screen-2xl px-4">
            <div className="mx-auto max-w-4xl text-center">
              <Badge variant="secondary" className="mb-6">
                🎨 Digital Museum Experience
              </Badge>
              <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                Discover Museums <br />
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Around the World
                </span>
              </h1>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
                Explore amazing museums, join exciting events, and experience immersive virtual tours from the comfort
                of your home.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" className="text-base">
                  Explore Museums <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="text-base">
                  Virtual Tour Demo
                </Button>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-20 left-10 h-20 w-20 rounded-full bg-primary/10 blur-xl"></div>
          <div className="absolute bottom-20 right-10 h-32 w-32 rounded-full bg-purple-500/10 blur-xl"></div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto max-w-screen-2xl px-4">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">150+</div>
                <div className="text-sm text-muted-foreground">Museums</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Events</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">1M+</div>
                <div className="text-sm text-muted-foreground">Visitors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Museums */}
        <section className="py-20">
          <div className="container mx-auto max-w-screen-2xl px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">Featured Museums</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Discover world-renowned museums and their incredible collections
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Museum Card 1 */}
              <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <Badge variant="secondary" className="mb-2">
                      Virtual Tour Available
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>Museum of Modern Art</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="h-4 w-4" />
                        New York, USA
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      4.8
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Explore contemporary masterpieces and cutting-edge installations in this world-famous museum.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      15k+ visitors/month
                    </div>
                    <Button size="sm" variant="outline">
                      Explore
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Museum Card 2 */}
              <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="aspect-video bg-gradient-to-br from-green-500 to-teal-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <Badge variant="secondary" className="mb-2">
                      360° Experience
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>Natural History Museum</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="h-4 w-4" />
                        London, UK
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      4.9
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Journey through millions of years of natural history with dinosaurs, minerals, and wildlife.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      25k+ visitors/month
                    </div>
                    <Button size="sm" variant="outline">
                      Explore
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Museum Card 3 */}
              <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="aspect-video bg-gradient-to-br from-orange-500 to-red-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <Badge variant="secondary" className="mb-2">
                      AR Experience
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>Ancient Egypt Museum</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="h-4 w-4" />
                        Cairo, Egypt
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      4.7
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Discover the treasures of ancient pharaohs and explore the mysteries of Egyptian civilization.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      12k+ visitors/month
                    </div>
                    <Button size="sm" variant="outline">
                      Explore
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <Button variant="outline" size="lg">
                View All Museums <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto max-w-screen-2xl px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">Upcoming Events</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Join exciting cultural events and exhibitions happening around the world
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Event Card 1 */}
              <Card className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge variant="default">Art Exhibition</Badge>
                    <div className="text-right text-sm">
                      <div className="font-semibold">MAR</div>
                      <div className="text-2xl font-bold text-primary">15</div>
                    </div>
                  </div>
                  <CardTitle className="mt-4">Impressionist Masters</CardTitle>
                  <CardDescription>Museum of Fine Arts, Paris</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    A rare collection of Monet, Renoir, and Degas paintings gathered for this special exhibition.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>10:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>234 interested</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4">Get Tickets</Button>
                </CardContent>
              </Card>

              {/* Event Card 2 */}
              <Card className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary">Workshop</Badge>
                    <div className="text-right text-sm">
                      <div className="font-semibold">MAR</div>
                      <div className="text-2xl font-bold text-primary">22</div>
                    </div>
                  </div>
                  <CardTitle className="mt-4">Digital Art Creation</CardTitle>
                  <CardDescription>Tech Museum, San Francisco</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Learn to create stunning digital art using cutting-edge technology and VR tools.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>2:00 PM - 5:00 PM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>89 interested</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4">Register Now</Button>
                </CardContent>
              </Card>

              {/* Event Card 3 */}
              <Card className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge variant="outline">Virtual Event</Badge>
                    <div className="text-right text-sm">
                      <div className="font-semibold">APR</div>
                      <div className="text-2xl font-bold text-primary">05</div>
                    </div>
                  </div>
                  <CardTitle className="mt-4">Ancient Rome VR Tour</CardTitle>
                  <CardDescription>Virtual Museum Experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Experience ancient Rome like never before with our immersive virtual reality tour.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>7:00 PM - 8:30 PM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>567 interested</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4">Join Virtual Tour</Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <Button variant="outline" size="lg">
                View All Events <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto max-w-screen-2xl px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">Why Choose MuseTrip360?</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Experience museums like never before with our cutting-edge digital platform
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Virtual Reality Tours</h3>
                <p className="text-muted-foreground">
                  Explore museums from anywhere with immersive 360° virtual reality experiences.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Live Events</h3>
                <p className="text-muted-foreground">
                  Join real-time exhibitions, workshops, and cultural events with museum experts.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Global Community</h3>
                <p className="text-muted-foreground">
                  Connect with fellow culture enthusiasts and share your museum experiences.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto max-w-screen-2xl px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to Start Exploring?</h2>
            <p className="mx-auto mb-8 max-w-2xl text-primary-foreground/90">
              Join thousands of culture enthusiasts discovering amazing museums and events worldwide.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" variant="secondary">
                Create Free Account
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
              >
                Browse Museums
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto max-w-screen-2xl px-4 py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Globe className="h-4 w-4" />
                </div>
                <span className="font-bold">MuseTrip360</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Connecting people with cultural heritage through immersive digital experiences.
              </p>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost">
                  <Instagram className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost">
                  <Youtube className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="mb-4 font-semibold">Explore</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Museums
                  </a>
                </div>
                <div>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Events
                  </a>
                </div>
                <div>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Virtual Tours
                  </a>
                </div>
                <div>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Collections
                  </a>
                </div>
              </div>
            </div>

            {/* Support */}
            <div>
              <h3 className="mb-4 font-semibold">Support</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Help Center
                  </a>
                </div>
                <div>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Contact Us
                  </a>
                </div>
                <div>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </div>
                <div>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Terms of Service
                  </a>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="mb-4 font-semibold">Contact</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>hello@musetrip360.com</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>San Francisco, CA</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
            <div>© 2024 MuseTrip360. All rights reserved.</div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
