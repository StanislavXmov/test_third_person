import { FloorBlock} from './FloorBlock';
import { WallBlock } from './WallBlock';

export const BlocksLevel = () => {
  return (
    <group>
      <WallBlock position={[0, 0, -2.5]} />
      <FloorBlock position={[0, -0.2, 0]} />
      <FloorBlock position={[-8, 0.2, 0]} />
      <FloorBlock position={[8, -0.4, 0]} />
      <WallBlock position={[0, 0, 2.5]} />
    </group>
  )
}
