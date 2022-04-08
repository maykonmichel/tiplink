import ActionsPanelTitleBar from './ui/ActionsPanelTitleBar';
import Box from '@mui/material/Box';
import { useActionState } from './state/useActionState';
import Typography from '@mui/material/Typography';
import CurrencyInput from '../common/CurrencyInput';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { useLink } from '../../useLink';
import LinkExportPanel from '../main/LinkExportPanel';
import { randBuf, DEFAULT_TIPLINK_KEYLENGTH, SEED_LENGTH, kdfz } from '../../../lib/crypto';
import { Keypair } from '@solana/web3.js';
import { getLinkPath } from '../../../lib/link';

const CreateTipLink = () => {
  const { goBack } = useActionState();
  const [inputAmountSol, setInputAmountSol] = useState<number>(NaN);
  const { getFees, sendSOL, balanceSOL } = useLink();
  const [ loading, setLoading ] = useState<boolean>(false);
  const [ newLink, setNewLink ] = useState<string>("");


  const splitTipLink = async () => {
    // TODO validate PublicKey and amount
    // TODO treat full amount differently
    setLoading(true);
    const fees = await getFees();
    const amt = inputAmountSol + fees;
    if(amt > balanceSOL) {
        alert("Cannot withdraw more than balance after fees");
        setLoading(false);
        return;
    }

    randBuf(DEFAULT_TIPLINK_KEYLENGTH).then((b) => {
      kdfz(SEED_LENGTH, b).then((seed: Buffer) => {
        const kp = Keypair.fromSeed(seed);
        sendSOL(kp.publicKey, amt).then(() => {
          setLoading(false);
          setNewLink(window.location.origin + getLinkPath(b));
        }).catch((err) => {
          if(err instanceof Error) {
              alert(err.message);
              setLoading(false);
              return;
          }
        });
      })
    });
  };

  return (
    <Box width='100%'>
      <ActionsPanelTitleBar title='Create TipLink' backOnClick={goBack} />
      { newLink === "" ? 
        <div>
          <Typography textAlign='center' style={{marginTop: '1rem', marginBottom: '1rem'}}>
            How much do you want to send?
          </Typography>
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <CurrencyInput
              fiatCurrency='USD'
              cryptoCurrency='SOL'
              onValueChange={setInputAmountSol}/>
            <Button
              style={{marginTop: '1rem'}}
              variant='outlined'
              onClick={splitTipLink}
              disabled={loading}
            >
              Create
            </Button>
          </Box>
        </div>
        : 
        <LinkExportPanel url={newLink} newTab={true}/>
      }
    </Box>
  );
};

export default CreateTipLink;
