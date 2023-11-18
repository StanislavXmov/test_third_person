import { Debug } from '@react-three/cannon';
// import { Floor } from './Floor';
import { ThirdPersonPlayer } from './ThirdPersonPlayer';
// import { Ground } from './Ground';
// import { Island } from './Island';
// import { ObjectModel } from './ObjectModel';
import { BlocksLevel } from './level/BlocksLevel';

type Props = {
  children?: React.ReactNode
};

const ToggleDebug: React.FC<Props> = ({ children }) => {
  const visible = false;

  return <>{visible ? <Debug>{children}</Debug> : <>{children}</>}</>
}

export const Level = () => {

  return (
    <>
      <ToggleDebug>
        {/* <Floor /> */}
        {/* <Ground /> */}
        {/* <Island position={[12, 0.5, 5]} /> */}
        {/* <ObjectModel position={[4, 0, 1]} /> */}
        {/* platformer */}
        <BlocksLevel />
        <ThirdPersonPlayer position={[0, 1, 0]} />
      </ToggleDebug>
    </>
  )
}
