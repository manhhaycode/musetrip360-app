// 'use client';
// import Image from 'next/image';
// import Link from 'next/link';
// import {
//   Container,
//   Title,
//   Text,
//   Button,
//   Card,
//   Group,
//   Badge,
//   SimpleGrid,
//   Divider,
//   Box,
//   Paper,
//   ThemeIcon,
// } from '@mantine/core';

// const featuredExhibitions = [
//   {
//     id: 1,
//     title: 'Ancient Civilizations',
//     description:
//       'Explore the wonders of ancient Egypt, Greece, and Rome through interactive 3D models and virtual tours.',
//     image: '/exhibitions/ancient-civilizations.jpg',
//     date: 'Permanent Exhibition',
//     category: 'History',
//   },
//   {
//     id: 2,
//     title: 'Modern Art Masterpieces',
//     description: 'Discover the revolutionary works of the 20th century that changed the course of art history forever.',
//     image: '/exhibitions/modern-art.jpg',
//     date: 'Jan 15 - Mar 30, 2024',
//     category: 'Art',
//   },
//   {
//     id: 3,
//     title: 'Natural Wonders',
//     description:
//       'Journey through the most spectacular natural phenomena on Earth with immersive virtual reality experiences.',
//     image: '/exhibitions/natural-wonders.jpg',
//     date: 'Opening Feb 10, 2024',
//     category: 'Science',
//   },
// ];

// const upcomingEvents = [
//   {
//     id: 1,
//     title: 'Curator Talk: Hidden Stories of the Museum',
//     date: 'Jan 25, 2024 | 6:00 PM',
//     type: 'Lecture',
//   },
//   {
//     id: 2,
//     title: 'Interactive Workshop for Children',
//     date: 'Feb 5, 2024 | 10:00 AM',
//     type: 'Workshop',
//   },
//   {
//     id: 3,
//     title: 'Night at the Museum: Special After-Hours Tour',
//     date: 'Feb 15, 2024 | 8:00 PM',
//     type: 'Tour',
//   },
// ];

// export default function Home() {
//   return (
//     <div>
//       {/* Hero Section */}
//       <Box
//         className="relative h-[70vh] flex items-center"
//         style={{
//           backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(/next.svg)',
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//         }}
//       >
//         <Container size="xl">
//           <div className="max-w-2xl text-white">
//             <Title order={1} className="text-4xl md:text-5xl font-bold mb-4">
//               Welcome to MuseTrip360
//             </Title>
//             <Text className="text-lg md:text-xl mb-6">
//               Discover our world-class exhibitions and cultural events. Experience history, art, and science like never
//               before through immersive digital experiences.
//             </Text>
//             <Group>
//               <Button size="lg" variant="filled">
//                 Explore Exhibitions
//               </Button>
//               <Button size="lg" variant="outline" color="white">
//                 Plan Your Visit
//               </Button>
//             </Group>
//           </div>
//         </Container>
//       </Box>

//       {/* Featured Exhibitions */}
//       <Container size="xl" className="py-16">
//         <Title order={2} className="text-3xl font-bold mb-8 text-center">
//           Featured Exhibitions
//         </Title>
//         <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
//           {featuredExhibitions.map((exhibition) => (
//             <Card key={exhibition.id} shadow="sm" padding="lg" radius="md" withBorder>
//               <Card.Section>
//                 <div className="h-48 bg-gray-200 flex items-center justify-center">
//                   <Image src="/next.svg" alt={exhibition.title} width={180} height={38} className="opacity-50" />
//                 </div>
//               </Card.Section>

//               <Group justify="space-between" mt="md" mb="xs">
//                 <Text fw={500} size="lg">
//                   {exhibition.title}
//                 </Text>
//                 <Badge>{exhibition.category}</Badge>
//               </Group>

//               <Text size="sm" color="dimmed" className="mb-4">
//                 {exhibition.description}
//               </Text>

//               <Text size="sm" color="dimmed" fw={500} className="mb-4">
//                 {exhibition.date}
//               </Text>

//               <Button variant="light" fullWidth mt="md" radius="md">
//                 Learn More
//               </Button>
//             </Card>
//           ))}
//         </SimpleGrid>
//       </Container>

//       {/* Upcoming Events and Visit Info */}
//       <Box className="bg-gray-50 dark:bg-gray-900 py-16">
//         <Container size="xl">
//           <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
//             {/* Upcoming Events */}
//             <div>
//               <Title order={2} className="text-2xl font-bold mb-6">
//                 Upcoming Events
//               </Title>
//               <div className="space-y-4">
//                 {upcomingEvents.map((event) => (
//                   <Paper key={event.id} shadow="xs" p="md" withBorder>
//                     <Group justify="space-between">
//                       <div>
//                         <Text fw={500}>{event.title}</Text>
//                         <Text size="sm" color="dimmed">
//                           {event.date}
//                         </Text>
//                       </div>
//                       <Badge color="">{event.type}</Badge>
//                     </Group>
//                   </Paper>
//                 ))}
//               </div>
//               <Button variant="subtle" className="mt-4">
//                 View All Events
//               </Button>
//             </div>

//             {/* Visit Information */}
//             <div>
//               <Title order={2} className="text-2xl font-bold mb-6">
//                 Plan Your Visit
//               </Title>
//               <Paper shadow="xs" p="lg" withBorder>
//                 <div className="space-y-4">
//                   <div>
//                     <Text fw={500} className="mb-1">
//                       Opening Hours
//                     </Text>
//                     <Text size="sm">Monday - Friday: 9:00 AM - 6:00 PM</Text>
//                     <Text size="sm">Saturday - Sunday: 10:00 AM - 8:00 PM</Text>
//                   </div>
//                   <Divider />
//                   <div>
//                     <Text fw={500} className="mb-1">
//                       Admission
//                     </Text>
//                     <Text size="sm">Adults: $15</Text>
//                     <Text size="sm">Students & Seniors: $10</Text>
//                     <Text size="sm">Children under 12: Free</Text>
//                   </div>
//                   <Divider />
//                   <div>
//                     <Text fw={500} className="mb-1">
//                       Location
//                     </Text>
//                     <Text size="sm">123 Museum Avenue</Text>
//                     <Text size="sm">City, State 12345</Text>
//                   </div>
//                 </div>
//                 <Button variant="filled" fullWidth className="mt-6">
//                   Get Tickets
//                 </Button>
//               </Paper>
//             </div>
//           </SimpleGrid>
//         </Container>
//       </Box>

//       {/* Museum Highlights */}
//       <Container size="xl" className="py-16">
//         <Title order={2} className="text-3xl font-bold mb-8 text-center">
//           Museum Highlights
//         </Title>
//         <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
//           <Paper p="xl" radius="md" className="border border-gray-200 dark:border-gray-800">
//             <ThemeIcon size={50} radius="md" className="mb-4">
//               <span className="text-xl">🏛️</span>
//             </ThemeIcon>
//             <Title order={3} className="text-xl font-medium mb-2">
//               Virtual Tours
//             </Title>
//             <Text size="sm" color="dimmed">
//               Experience our exhibitions from anywhere in the world through immersive virtual tours.
//             </Text>
//           </Paper>

//           <Paper p="xl" radius="md" className="border border-gray-200 dark:border-gray-800">
//             <ThemeIcon size={50} radius="md" className="mb-4">
//               <span className="text-xl">🔍</span>
//             </ThemeIcon>
//             <Title order={3} className="text-xl font-medium mb-2">
//               Interactive Exhibits
//             </Title>
//             <Text size="sm" color="dimmed">
//               Engage with history and art through our cutting-edge interactive digital exhibits.
//             </Text>
//           </Paper>

//           <Paper p="xl" radius="md" className="border border-gray-200 dark:border-gray-800">
//             <ThemeIcon size={50} radius="md" className="mb-4">
//               <span className="text-xl">🎓</span>
//             </ThemeIcon>
//             <Title order={3} className="text-xl font-medium mb-2">
//               Educational Programs
//             </Title>
//             <Text size="sm" color="dimmed">
//               Discover our range of programs designed for learners of all ages and backgrounds.
//             </Text>
//           </Paper>
//         </SimpleGrid>
//       </Container>

//       {/* Newsletter Subscription */}
//       <Box className="bg-primary-500 dark:bg-primary-900 text-white py-16">
//         <Container size="md" className="text-center">
//           <Title order={2} className="text-2xl font-bold mb-4">
//             Stay Updated
//           </Title>
//           <Text className="mb-6">Subscribe to our newsletter for the latest exhibitions, events, and museum news.</Text>
//           <div className="max-w-md mx-auto">
//             <div className="flex flex-col sm:flex-row gap-2">
//               <input
//                 type="email"
//                 placeholder="Your email address"
//                 className="flex-1 px-4 py-2 rounded-md border-none focus:outline-none text-black"
//               />
//               <Button variant="white" color="dark">
//                 Subscribe
//               </Button>
//             </div>
//           </div>
//         </Container>
//       </Box>

//       {/* Footer */}
//       <Box className="bg-gray-900 text-white py-10">
//         <Container size="xl">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//             <div>
//               <Text fw={700} size="lg" className="mb-4">
//                 MuseTrip360
//               </Text>
//               <Text size="sm" color="dimmed">
//                 A digital platform for historical museums to create virtual exhibitions, manage cultural events, and
//                 provide intelligent visitor interactions.
//               </Text>
//             </div>

//             <div>
//               <Text fw={700} className="mb-4">
//                 Visit
//               </Text>
//               <div className="space-y-2">
//                 <Link href="#" className="block text-sm text-gray-300 hover:text-white">
//                   Hours & Admission
//                 </Link>
//                 <Link href="#" className="block text-sm text-gray-300 hover:text-white">
//                   Directions
//                 </Link>
//                 <Link href="#" className="block text-sm text-gray-300 hover:text-white">
//                   Accessibility
//                 </Link>
//                 <Link href="#" className="block text-sm text-gray-300 hover:text-white">
//                   Group Tours
//                 </Link>
//               </div>
//             </div>

//             <div>
//               <Text fw={700} className="mb-4">
//                 Explore
//               </Text>
//               <div className="space-y-2">
//                 <Link href="#" className="block text-sm text-gray-300 hover:text-white">
//                   Exhibitions
//                 </Link>
//                 <Link href="#" className="block text-sm text-gray-300 hover:text-white">
//                   Events
//                 </Link>
//                 <Link href="#" className="block text-sm text-gray-300 hover:text-white">
//                   Collections
//                 </Link>
//                 <Link href="#" className="block text-sm text-gray-300 hover:text-white">
//                   Education
//                 </Link>
//               </div>
//             </div>

//             <div>
//               <Text fw={700} className="mb-4">
//                 Connect
//               </Text>
//               <div className="space-y-2">
//                 <Link href="#" className="block text-sm text-gray-300 hover:text-white">
//                   Contact Us
//                 </Link>
//                 <Link href="#" className="block text-sm text-gray-300 hover:text-white">
//                   Support
//                 </Link>
//                 <Link href="#" className="block text-sm text-gray-300 hover:text-white">
//                   Facebook
//                 </Link>
//                 <Link href="#" className="block text-sm text-gray-300 hover:text-white">
//                   Instagram
//                 </Link>
//               </div>
//             </div>
//           </div>

//           <Divider className="my-8" />

//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <Text size="sm" color="dimmed">
//               © 2024 MuseTrip360. All rights reserved.
//             </Text>
//             <div className="flex gap-4 mt-4 md:mt-0">
//               <Link href="#" className="text-sm text-gray-300 hover:text-white">
//                 Privacy Policy
//               </Link>
//               <Link href="#" className="text-sm text-gray-300 hover:text-white">
//                 Terms of Service
//               </Link>
//             </div>
//           </div>
//         </Container>
//       </Box>
//     </div>
//   );
// }

export default function Home() {
  return <div>Hello World</div>;
}
