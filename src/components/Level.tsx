import { Debug } from '@react-three/cannon';
import { Floor } from './Floor';
import { ThirdPersonPlayer } from './ThirdPersonPlayer';
import { Ground } from './Ground';

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
        <Ground />
        <ThirdPersonPlayer position={[0, 1, 0]} />
      </ToggleDebug>
    </>
  )
}
