import { Container } from '@/components/layout/container'
export default function PublicLayout(props: { children: React.ReactNode }) {
  return <Container className="py-6">{props.children}</Container>
}
