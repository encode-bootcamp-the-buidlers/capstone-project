# Dao's Got Talent - Encode Club Bootcamp final project

## Team: The Buidlers. 
* Alok Sahay <alok.sahay87@gmail.com>
* Ana G. Jordano <anagjordano@gmail.com>
* Lucien Akchoté <l.akchote@gmail.com>
* Sid Lamichhane
* Tobias Leinss <caruso33@web.de>
* Vid Topolovec <weetopol@gmail.com>

## Objective

Dao's got talent is a talent finding DAO in the crowded NFT space. DAO members view and vote on contesting NFT collections and upon conclusion the winning collection gets automatically minted. The top members who voted for the winning collection receive an NFT airdrop when the collection goes live. The automated minting and airdrop is triggered by a Chainlink Keeper.

## How it works

1. A proposal is created for the NFT collection applicants (artists).
2. DAO members have voting powers based on the governance tokens they hold (DAOGT tokens).
3. The sample collections are uploaded to IPFS. DAO members vote on the collection of their preference.
4. Voting has a token cost associated with it, DAOGT tokens are burnt upon casting the vote.
5. When the vote is concluded, the winning proposal gets a green light and triggers a Chainlink Keeper that calls the mint function on the governance contract to ensure that the vote is honoured without any external influence. 
6. Once the mint is complete, the collection airdrops an NFT to the high council members. 

## Future roadmap

* Non linear voting right calculation to avoid whale manipulation in the DAO
* Dynamic token voting cost based on circulating supply
* Tier system for DAO members, high council gets airdrops whereas others get whitelisting
* Timelocking of tokens before voting to avoid last minute buy in
* DAOGT token required for artists to participate with their collection to avoid spam.

## Explorer links

DAOGT token: https://rinkeby.etherscan.io/token/0x0184a705f7801f8a8a31ffd0712e315979ceb4fd

Governance contract: https://rinkeby.etherscan.io/address/0x666dbd201c02d584c8614ebc45555a10dc4cdcdd

Winning NFT collection: https://rinkeby.etherscan.io/token/0x58073f5394ded4f0e77d6d76cd338e4e38f60aaf

