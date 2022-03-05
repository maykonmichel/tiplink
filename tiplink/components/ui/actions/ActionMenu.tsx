import DefaultActions from './DefaultActions';
import { useState } from 'react';


const ActionMenu = () => {
    const [state, setState] = useState<string>("initial");
    return(
        <div>
            {
                {
                    'initial': <DefaultActions/>
                }[state]
            }
        </div>
    );
}

export default ActionMenu;