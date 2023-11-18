import { FloorBlock} from './FloorBlock';

export const BlocksLevel = () => {
  return (
    <group>
      <FloorBlock position={[0, -0.2, 0]} />
      <FloorBlock position={[-8, 0.2, 0]} />
      <FloorBlock position={[8, -0.4, 0]} />
    </group>
  )
}
