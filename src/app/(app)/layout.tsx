import { AppNav } from "../../components/layout/app-nav"
import { Container } from "@/components/layout/container"
export default function AppLayout(props: { children: React.ReactNode }) {
  return (
    <Container className="py-6">
      <AppNav />
      <div className="mt-6">{props.children}</div>
    </Container>
  )
}
