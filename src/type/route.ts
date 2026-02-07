export interface routesData {
  component?: any
  meta: {
    id: string
    name: string
    path: string
    icon?: string
  }
  name?: string
  children?: routesData[]
  redirect?: string
  path?: string
}
