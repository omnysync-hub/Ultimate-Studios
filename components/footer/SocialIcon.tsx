type Props = { id: string };

export function SocialIcon({ id }: Props) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": true as const,
    focusable: false as const
  };

  switch (id) {
    case "youtube":
      return (
        <svg {...common}>
          <path d="M23.5 7.2a3 3 0 0 0-2.1-2.1C19.5 4.5 12 4.5 12 4.5s-7.5 0-9.4.6A3 3 0 0 0 .5 7.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-4.8ZM9.75 15.5v-7l6.5 3.5-6.5 3.5Z" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common}>
          <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Zm-5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5Zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5ZM17.5 6.75a1.1 1.1 0 1 1-1.1 1.1 1.1 1.1 0 0 1 1.1-1.1Z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg {...common}>
          <path d="M19.6 7.3a6.7 6.7 0 0 1-3.9-1.3v7.4a5.7 5.7 0 1 1-4.9-5.6v2.9a2.8 2.8 0 1 0 2 2.7V2.5h2.8a6.7 6.7 0 0 0 4 4.1v2.7Z" />
        </svg>
      );
    case "x":
      return (
        <svg {...common}>
          <path d="M18.2 2H21l-6.6 7.5L22 22h-6.2l-4.9-6.4L5.3 22H2.5l7-8L2 2h6.3l4.4 5.8L18.2 2Zm-1.1 18h1.7L7 3.9H5.2L17.1 20Z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common}>
          <path d="M4.98 3.5A2.5 2.5 0 1 1 2.5 6a2.5 2.5 0 0 1 2.48-2.5ZM3 8.5h4V21H3V8.5ZM9.5 8.5H13v1.7h.05c.5-.95 1.7-2 3.5-2 3.7 0 4.4 2.4 4.4 5.6V21h-4v-6.1c0-1.5 0-3.4-2.1-3.4s-2.4 1.6-2.4 3.3V21h-4V8.5Z" />
        </svg>
      );
    default:
      return null;
  }
}
