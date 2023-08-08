import { Debug } from '@react-three/cannon';
import { Floor } from './Floor';

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
        <Floor />
      </ToggleDebug>
    </>
  )
}
