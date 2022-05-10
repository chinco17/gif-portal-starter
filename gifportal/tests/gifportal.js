const anchor = require('@project-serum/anchor')

const main =  async() => {
  console.log("Starting test...");

  //const provider = anchor.Provider.env();                         //not working
  const provider = anchor.AnchorProvider.env();
  //const provider = anchor.AnchorProvider.local();                 //localnet test
  //const provider = anchor.Provider.local("http://127.0.0.1:8899");  //devnet test
  anchor.setProvider(provider);
  const program = anchor.workspace.Gifportal;

  const baseAccount = anchor.web3.Keypair.generate();
  const tx = await program.rpc.startStuffOff({
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
    signers: [baseAccount],
  });
  console.log("Your transaction signature", tx);
  
  let account = await program.account.baseAccount.fetch(baseAccount.publicKey)
  console.log("GIFCount", account.totalGifs.toString());

  await program.rpc.addGif("https://i.gifer.com/Nt3d.gif", {
    accounts:{
      baseAccount:baseAccount.publicKey,  
      user: provider.wallet.publicKey,
    },
  });
    account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log("GIFCount", account.totalGifs.toString());
    console.log("GIFLIST", account.gifLis);
};

const runMain = async() =>{
  try{
    await main();
    process.exit(0);

  }catch(error){
    console.error(error);
    process.exit(1);
  }
};

runMain();

