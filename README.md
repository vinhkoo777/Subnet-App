# SubnetStreak

IPv4 Subnetting Trainer for CCNA 200-301 preparation.

SubnetStreak is a browser-based learning platform that helps users practice IPv4 subnetting through random questions, step-by-step explanations, progress tracking, XP, and streak systems.

## Screenshots

### Dashboard

<img width="1891" height="947" alt="image" src="https://github.com/user-attachments/assets/b049142f-ffec-4bd4-9ab7-0d377cf37a65" />

### Practice Mode

<img width="1902" height="928" alt="image" src="https://github.com/user-attachments/assets/0bed703b-8ff3-4548-a633-c153a597110d" />

### Challenge Mode

<img width="1897" height="923" alt="image" src="https://github.com/user-attachments/assets/0f18cfad-a241-4753-a3ef-631b8c00a475" />

### Setting

<img width="1918" height="937" alt="image" src="https://github.com/user-attachments/assets/400ee7ad-fdc4-4e8a-a90a-0057805754eb" />

## Features

- Unlimited IPv4 subnetting practice
- Random question generation
- Step-by-step subnet explanations
- Network address, broadcast, CIDR, wildcard mask, VLSM, and routing-related subnetting
- Multiple practice modes:
  - Daily Challenge
  - Speed Run
  - Survival
  - Time Attack
  - Exam Mode
  - Boss Challenge
- XP, streaks, statistics, and learning history
- LocalStorage-based progress saving

## Testing

The subnet engine is validated with:

- 10,000 subnet calculations
- 10,000 generated questions

Run tests:

```bash
npm test
```

Other checks:

```bash
npm run type-check
npm run lint
npm run build
```

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Lucide React

## Installation

Clone the repository:

```bash
git clone https://github.com/vinhkoo777/Subnet-App.git
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

## Project Goal

This project was created to improve IPv4 subnetting skills for CCNA preparation while combining networking knowledge with modern frontend development.

