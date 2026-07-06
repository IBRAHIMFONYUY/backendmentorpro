
import { LucideProps } from "lucide-react";

export const Icons = {
  logo: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M7 7l10 10" />
      <path d="M7 17L17 7" />
      <path d="M12 2a10 10 0 1 0 10 10" />
      <path d="M12 2a10 10 0 0 1-8.5 15.5" />
    </svg>
  ),
  google: (props: LucideProps) => (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Google</title>
      <path
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12.293s5.56 12.293 12.173 12.293c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.173H12.48z"
        fill="currentColor"
      />
    </svg>
  ),
  nodejs: (props: LucideProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M11.99 24a12 12 0 0 1-5.6-22.37 12 12 0 0 1 11.2 22.37A11.92 11.92 0 0 1 11.99 24zM8.86 6.13c.4-1.55 2.1-2.04 3.33-1.16a2 2 0 0 1 .86 2.4l-3.32 9.52c-.4 1.55-2.1 2.04-3.33 1.16a2 2 0 0 1-.86-2.4z"/>
    </svg>
  ),
  python: (props: LucideProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M14.28.3a4.4 4.4 0 0 0-4.2 2.65V4.6a2.74 2.74 0 0 1-1.5-2.27A4.4 4.4 0 0 0 4.38.3H0v4.27a4.27 4.27 0 0 0 4.27 4.28h1.67v1.47H1.67a4.27 4.27 0 0 0-4.27 4.27v4.28h4.27a4.4 4.4 0 0 0 4.2-2.65V19.4a2.74 2.74 0 0 1 1.5 2.27 4.4 4.4 0 0 0 4.2 2.68h4.22v-4.27a4.27 4.27 0 0 0-4.27-4.28h-1.67v-1.47h1.67a4.27 4.27 0 0 0 4.27-4.27V.3h-4.27z"/>
    </svg>
  ),
  java: (props: LucideProps) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path d="M4.6 23.7V.3h14.8v23.4zm10.7-7.6a3.1 3.1 0 0 1-1.3 2.5 4 4 0 0 1-2.9.8 3.7 3.7 0 0 1-2.8-.9 3.1 3.1 0 0 1-1.2-2.4H4.9a6.8 6.8 0 0 0 2.2 4.9 7.6 7.6 0 0 0 5.4 1.8 7.4 7.4 0 0 0 5.4-1.8 6.8 6.8 0 0 0 2.2-4.9v-5.2h-2.4v4.4z"/>
      </svg>
  ),
  mongodb: (props: LucideProps) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path d="M12 24C5.37 24 0 18.63 0 12S5.37 0 12 0s12 5.37 12 12-5.37 12-12 12zm0-2a10 10 0 1 0 0-20 10 10 0 0 0 0 20zm-1-5.17V9.17a1 1 0 0 1 2 0v7.66a1 1 0 0 1-2 0z"/>
      </svg>
  ),
  postgresql: (props: LucideProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v8h-2zm-4 4h2v4H7z"/>
    </svg>
  ),
  aws: (props: LucideProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.71 16.29l-3.58-3.58a1 1 0 0 1 1.41-1.41l2.88 2.88 6.88-6.88a1 1 0 0 1 1.41 1.41l-7.59 7.58a1 1 0 0 1-1.41 0z"/>
    </svg>
  ),
  php: (props: LucideProps) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-3.5-9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm7 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
      </svg>
  ),
  docker: (props: LucideProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M21.17 9.58A8.8 8.8 0 0 0 13 4a8.8 8.8 0 0 0-8.17 5.58A6.2 6.2 0 0 0 4 14.75a6.2 6.2 0 0 0 6.17 6.17h7.66A6.2 6.2 0 0 0 24 14.75a6.2 6.2 0 0 0-2.83-5.17zM9.5 17a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7zm5 0a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"/>
    </svg>
  ),
  graphql: (props: LucideProps) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM6 11h12v2H6zm-2-4h16v2H4zm8 8h2v-4h-2z"/>
      </svg>
  ),
  discord: (props: LucideProps) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path d="M20.3 3.7c-1.3-1-3-1.8-4.8-2.2-.5.3-.8.8-.9 1.4.5.2 1 .5 1.5.8-1.5-.5-3.1-.5-4.6 0 .5-.3 1-.6 1.5-.8-.1-.6-.4-1.1-.9-1.4-1.8.4-3.5 1.2-4.8 2.2C1.9 9.3 1.5 15.3 4 19.8c1.7 1.7 4 2.6 6.3 2.9.5-.3.8-.8.9-1.3-.5-.2-1-.5-1.5-.7 1.5.5 3.1.5 4.6 0-.5.2-1 .5-1.5.7.1.5.4 1 .9 1.3 2.3-.3 4.6-1.2 6.3-2.9 2.5-4.5 2.1-10.5-.7-16.1zM9.5 15.5c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5zm5 0c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5z"/>
      </svg>
  ),
};
