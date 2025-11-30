import { Container } from '@/components/layout/container'
export default function AdminLayout(props: { children: React.ReactNode }) {
  return <Container className="py-6">{props.children}</Container>
}
