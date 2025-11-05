import { ConnectButton} from '@rainbow-me/rainbowkit'

export const ConnectButtonComponent = () => {

    return (
        <ConnectButton
            label='Connect'
            showBalance={false}
            chainStatus="icon"
            accountStatus={{
                smallScreen: 'avatar',
                largeScreen: 'address',
            }} 
        />
    )
}


