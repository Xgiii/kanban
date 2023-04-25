import AuthCheck from '@/components/AuthCheck';

export default function Home() {
  
  return (
  <AuthCheck>
    <p className='ml-[30vw] mt-10'>Pick board to get started</p>
  </AuthCheck>)
}
