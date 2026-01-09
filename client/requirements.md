## Packages
framer-motion | Essential for smooth page transitions and number animations
clsx | Utility for constructing className strings conditionally
tailwind-merge | Utility to merge Tailwind classes without conflicts
lucide-react | Icon library (standard, but ensuring it's available)
date-fns | For date formatting in history

## Notes
- The app uses a "Mock UI" approach but connects to real endpoints defined in routes.ts.
- Authentication expects `Ashu2008@` as the password via `POST /api/auth/login`.
- Portfolio and Trade data is fetched from `/api/portfolio` and `/api/trades`.
- Animations are heavy (Framer Motion) to meet the "amazing" and "smooth" UI requirements.
- Layout uses a mobile-first bottom navigation structure.
