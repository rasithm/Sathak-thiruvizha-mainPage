import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
// import RegistrationModal from '../components/RegistrationModal'
// import { EVENTS } from '../lib/config'
import styles from './DevelopersPage.module.css'

import bafinImg from '../img/bafin.jpeg'
import deenaImg from '../img/deena.jpeg'
import fadhilImg from '../img/fadhil.jpeg'
import mishalImg from '../img/mishal.jpeg'
import pitcheeshwarImg from '../img/pitcheeshwar.jpeg'

const DEVELOPERS = [
    {
        name: 'Mohammed Baifin',
        image: bafinImg,
        github: 'https://github.com/Baifin',
        linkedin: 'https://www.linkedin.com/in/mohammed-baifin-b1b522328?utm_source=share_via&utm_content=profile&utm_medium=member_ios',
        email: 'mohammedbaifin.m@gmail.com'
    },
    {
        name: 'Deena V',
        image: deenaImg,
        github: 'https://github.com/deena303',
        linkedin: 'https://www.linkedin.com/in/deena-v-b95a63327',
        email: 'deenavenkatesan2006@gmail.com'
    },
    {
        name: 'Mohamed Fadhil',
        image: fadhilImg,
        github: 'https://github.com/Fadhil-123',
        linkedin: 'https://www.linkedin.com/in/mohamed-fadhil-830a80327?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
        email: 'fadhilfazil18@gmail.com'
    },
    {
        name: 'Mishal N',
        image: mishalImg,
        github: 'https://github.com/Mishal-N',
        linkedin: 'https://www.linkedin.com/in/mishal-n-72a527328',
        email: 'mishalnoormohamed2006@gmail.com'
    },
    {
        name: 'Pitcheeshwar R',
        image: pitcheeshwarImg,
        github: 'https://github.com/pitcheeswar17',
        linkedin: 'https://www.linkedin.com/in/pitche-eshwar-r-363a62327?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
        email: 'pitcheeswarrajamani01@gmail.com'
    }
]

// Custom Icons for Socials
const GitHubIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
)

const LinkedInIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
)

const EmailIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
)

export default function DevelopersPage() {
    const [regModal, setRegModal] = useState({ open: false, event: null })

    const openRegister = (event = null) => setRegModal({ open: true, event })
    const closeRegister = () => setRegModal({ open: false, event: null })

    // Smooth scroll to top on mount
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [])

    return (
        <div className={styles.pageWrapper}>
            <Navbar onRegister={() => openRegister()} />

            <main className={styles.mainContainer}>
                {/* Header Section */}
                <section className={styles.headerSection}>
                    <div className={styles.headerBadge}>
                        <span className={styles.headerBadgeDot} />
                        <span>Behind The Scenes</span>
                    </div>
                    <h1 className={styles.pageTitle}>
                        Meet the <span className={styles.titleHighlight}>Developers</span>
                    </h1>
                    <p className={styles.pageSubtitle}>
                        The team behind the Habibi Fest platform. Building the future, one line of code at a time.
                    </p>
                </section>

                {/* Developers Grid */}
                <section className={styles.gridSection}>
                    <div className="container">
                        <div className={styles.developersGrid}>
                            {DEVELOPERS.map((dev, index) => (
                                <div
                                    key={dev.name}
                                    className={styles.developerCard}
                                    style={{ animationDelay: `${index * 0.15}s` }}
                                >
                                    <div className={styles.cardGlow} />

                                    <div className={styles.imageContainer}>
                                        <img
                                            src={dev.image}
                                            alt={dev.name}
                                            className={styles.profileImage}
                                            loading="lazy"
                                        />
                                    </div>

                                    <h3 className={styles.devName}>{dev.name}</h3>
                                    <div className={styles.devRole}>Full Stack Developer</div>

                                    <div className={styles.socialLinks}>
                                        <a href={dev.github} target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label={`${dev.name}'s GitHub`}>
                                            <GitHubIcon />
                                        </a>
                                        <a href={dev.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label={`${dev.name}'s LinkedIn`}>
                                            <LinkedInIcon />
                                        </a>
                                        <a href={`mailto:${dev.email}`} className={styles.socialBtn} aria-label={`Email ${dev.name}`}>
                                            <EmailIcon />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <footer className={styles.footer}>
                <div className="container text-center">
                    <p>© 2026 Habibi Fest · MSAJCE Chennai. All rights reserved.</p>
                </div>
            </footer>

            {regModal.open && (
                <RegistrationModal
                    event={regModal.event}
                    allEvents={EVENTS}
                    onClose={closeRegister}
                />
            )}
        </div>
    )
}
