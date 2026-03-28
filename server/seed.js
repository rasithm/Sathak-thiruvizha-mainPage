// Run this ONCE after starting the server to seed initial events
// Usage: node server/seed.js
// Make sure server is running on localhost:5000

const API = 'http://localhost:5000/api'

async function seed() {
  // 1. Login
  const loginRes = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'habibi2026' }),
  })
  const { token } = await loginRes.json()
  if (!token) { console.error('Login failed'); process.exit(1) }

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }

  // 2. Seed events
  const events = [
    // ── Day 1 ────────────────────────────────────────────────────
    {
      slug: 'grand-opening', day: 'day1', category: 'cultural',
      name: 'Grand Opening', tagline: 'The Ignition',
      description: 'A spectacular inauguration with celebrity guests, flame performances, drone light show and orchestral welcome.',
      icon: '🔥', accent: '#FFD700',
      date: 'April 6, 2026', time: '9AM–9PM', duration: 'Full Day',
      seatCapacity: 2000, teamSize: 'Open', entryFee: 0,
      venue: 'Main Auditorium, MSAJCE',
      googleFormLink: '',
      cashPrize: '',
      perks: ['Celebrity Chief Guest', 'Drone Light Show', 'Opening Concert'],
      features: ['Grand Inauguration', 'Flash Mob', 'Drone Show', 'College Parades'],
      order: 1, isActive: true,
    },

    // ── Day 2 ────────────────────────────────────────────────────
    {
      slug: 'code-blitz', day: 'day2', category: 'technical',
      name: 'Code Blitz', tagline: 'Competitive Coding',
      description: 'High-intensity competitive coding battle. Solve algorithmic challenges against the best programmers from across Tamil Nadu.',
      icon: '💻', accent: '#00F5FF',
      date: 'April 7, 2026', time: '10AM–1PM', duration: '3 hrs',
      seatCapacity: 150, teamSize: '1–2', entryFee: 100,
      venue: 'CS Lab Block, MSAJCE',
      googleFormLink: '',
      cashPrize: '',
      perks: ['Certificates', 'Cash Prize', 'Tech Goodies'],
      features: ['Algorithmic Challenges', 'Live Leaderboard', 'Lightning Rounds'],
      order: 1, isActive: true,
    },
    {
      slug: 'robo-race', day: 'day2', category: 'technical',
      name: 'Robo Race Arena', tagline: 'Metal Meets Speed',
      description: 'Engineer and race your own bot through an obstacle course.',
      icon: '🤖', accent: '#00F5FF',
      date: 'April 7, 2026', time: '9AM–5PM', duration: 'Full Day',
      seatCapacity: 60, teamSize: '2–4', entryFee: 200,
      venue: 'Open Arena, MSAJCE',
      googleFormLink: '',
      cashPrize: '',
      perks: ['Best Design Award', 'Cash Prize', 'Trophy'],
      features: ['Arena Course', 'Time Trials', 'Combat Round'],
      order: 2, isActive: true,
    },
    {
      slug: 'startup-pitch', day: 'day2', category: 'technical',
      name: 'Startup Pitch Battle', tagline: 'Investors Are Watching',
      description: 'Pitch your startup idea to a panel of investors and industry leaders.',
      icon: '🚀', accent: '#00F5FF',
      date: 'April 7, 2026', time: '2PM–6PM', duration: '4 hrs',
      seatCapacity: 40, teamSize: '1–4', entryFee: 0,
      venue: 'Innovation Lab, MSAJCE',
      googleFormLink: '',
      cashPrize: '',
      perks: ['Investor Meets', 'Incubation Opportunity', 'Cash Prize'],
      features: ['3-Min Pitch', 'Q&A Panel', 'Demo Showcase'],
      order: 3, isActive: true,
    },
    {
      slug: 'paper-presentation', day: 'day2', category: 'technical',
      name: 'Paper Presentation', tagline: 'Research Takes the Stage',
      description: 'Present your original research to academic judges.',
      icon: '📄', accent: '#00F5FF',
      date: 'April 7, 2026', time: '10AM–12PM', duration: '2 hrs',
      seatCapacity: 80, teamSize: '1–3', entryFee: 50,
      venue: 'Seminar Hall A, MSAJCE',
      googleFormLink: '',
      cashPrize: '',
      perks: ['Best Paper Award', 'Publication Opportunity', 'Certificates'],
      features: ['10-Min Presentation', 'Judge Q&A', 'Award Ceremony'],
      order: 4, isActive: true,
    },

    // ── Day 3 ────────────────────────────────────────────────────
    {
      slug: 'cultural-events', day: 'day3', category: 'cultural',
      name: 'Cultural Events', tagline: 'Art, Music & Drama',
      description: 'A vibrant showcase of cultural talent — music, dance, drama, and fine arts from colleges across Tamil Nadu.',
      icon: '🎭', accent: '#FF6B35',
      date: 'April 8, 2026', time: '10AM–8PM', duration: 'Full Day',
      seatCapacity: 1000, teamSize: 'Open', entryFee: 0,
      venue: 'Main Stage, MSAJCE',
      googleFormLink: '',
      cashPrize: '',
      perks: ['Certificates', 'Trophies', 'Cash Awards'],
      features: ['Solo Singing', 'Group Dance', 'Skit', 'Fine Arts', 'Photography'],
      order: 1, isActive: true,
    },
    {
      slug: 'proshow', day: 'day3', category: 'special',
      name: 'Proshow Night', tagline: 'The Main Stage',
      description: 'National recording artists. Pyrotechnics. Laser grids. LED walls. 5000+ students from across Tamil Nadu.',
      icon: '🎤', accent: '#FF6B35',
      date: 'April 8, 2026', time: '5PM–11PM', duration: '6 hrs',
      seatCapacity: 5000, teamSize: 'Open', entryFee: 0,
      venue: 'Main Outdoor Stage, MSAJCE',
      googleFormLink: '',
      cashPrize: '',
      perks: ['Free Entry', 'Food Court', 'VIP Photo Meet'],
      features: ['National Artist Concert', 'DJ Bass Drop', 'Stand-up Comedy', 'Laser & Pyro Show'],
      order: 2, isActive: true,
    },

    // ── Day 4 ────────────────────────────────────────────────────
    {
      slug: 'habibi-a-thon', day: 'day4', category: 'hackathon',
      name: 'Habibi-A-Thon', tagline: 'Build. Break. Repeat.',
      description: '25 hours. One mission. Unlimited caffeine. 500+ builders across AI, Web3, HealthTech, and Sustainability tracks.',
      icon: '⚡', accent: '#00FF88',
      date: 'April 9, 2026', time: '9AM – April 10, 10AM', duration: '25 hrs',
      seatCapacity: 500, teamSize: '2–4', entryFee: 200,
      venue: 'Innovation Lab & CS Block, MSAJCE',
      googleFormLink: '',
      isHackathon: true,
      hackathonLink: 'https://forms.google.com/placeholder-hackathon-link',
      cashPrize: '₹1,00,000+',
      perks: ['Cash Prize ₹1,00,000+', 'Internship Shortlisting', 'Mentor Access', 'Certificates'],
      features: ['AI/ML Track', 'Web3 Track', 'HealthTech Track', 'GreenTech Track', 'Midnight Sprint', 'Final Demos'],
      order: 1, isActive: true,
    },

    // ── Day 5 ────────────────────────────────────────────────────
    {
      slug: 'street-dance-battle', day: 'day5', category: 'cultural',
      name: 'Street Dance Battle', tagline: 'Crew vs Crew',
      description: 'Crews of 4–8 compete in elimination rounds. Hip-hop, locking, popping, and freestyle.',
      icon: '💃', accent: '#BF00FF',
      date: 'April 10, 2026', time: '10AM–4PM', duration: '6 hrs',
      seatCapacity: 200, teamSize: '4–8', entryFee: 150,
      venue: 'Main Stage, MSAJCE',
      googleFormLink: '',
      cashPrize: '',
      perks: ['Trophy', 'Cash Prize', 'Certificate'],
      features: ['Qualifiers', 'Semi-Finals', 'Grand Final Showdown'],
      order: 1, isActive: true,
    },
    {
      slug: 'ramp-royale', day: 'day5', category: 'special',
      name: 'Ramp Royale', tagline: 'The Runway',
      description: 'Fashion meets art. Theme-based runway competition judged by industry designers.',
      icon: '👑', accent: '#BF00FF',
      date: 'April 10, 2026', time: '2PM–5PM', duration: '3 hrs',
      seatCapacity: 60, teamSize: 'Individual', entryFee: 100,
      venue: 'Main Auditorium, MSAJCE',
      googleFormLink: '',
      cashPrize: '',
      perks: ['Best Costume Award', 'Certificate', 'Spotlight Feature'],
      features: ['Theme Walk', 'Designer Panel', 'Crown Ceremony'],
      order: 2, isActive: true,
    },
    {
      slug: 'champions-gala', day: 'day5', category: 'special',
      name: 'Champions Awards Gala', tagline: 'Silver Jubilee Edition',
      description: 'The Grand Finale — crowning the champions of all 5 days. Awards, performances, and the Silver Jubilee special act.',
      icon: '🏆', accent: '#BF00FF',
      date: 'April 10, 2026', time: '7PM–11PM', duration: '4 hrs',
      seatCapacity: 3000, teamSize: 'Open', entryFee: 0,
      venue: 'Auditorium & Outdoor Stage, MSAJCE',
      googleFormLink: '',
      cashPrize: '',
      perks: ['Free Entry', 'Championship Trophy', 'Special Performance'],
      features: ['Awards Ceremony', 'Cultural Finale', 'Silver Jubilee Special Act'],
      order: 3, isActive: true,
    },
  ]

  const res = await fetch(`${API}/events/seed/init`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ events }),
  })
  const result = await res.json()
  console.log(`✅ Seeded ${result.inserted} events`)
}

seed().catch(console.error)
