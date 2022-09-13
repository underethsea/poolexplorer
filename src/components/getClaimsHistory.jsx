const CLAIMSGRAPH = [
    {
        NETWORK: 'optimism',
        URL: 'https://api.thegraph.com/subgraphs/name/pooltogether/optimism-v4-prizes-claimed',
    },
    {
        NETWORK: 'ethereum',
        URL: 'https://api.thegraph.com/subgraphs/name/pooltogether/mainnet-v4-prizes-claimed',
    },
    {
        NETWORK: 'avalanche',
        URL: 'https://api.thegraph.com/subgraphs/name/pooltogether/avalanche-v4-prizes-claimed',
    },
    {
        NETWORK: 'polygon',
        URL: 'https://api.thegraph.com/subgraphs/name/pooltogether/polygon-v4-prizes-claimed',
    },
];
const APIURL = 'https://api.thegraph.com/subgraphs/name/pooltogether/mainnet-v4-prizes-claimed';

const query = `
  query ($address : String){
      accounts(where: {id: $address}) {
        draws(first:500) {
          id
        }
      }
    }
`;

function processClaims(claimsJson) {
    let drawsClaimed = [];
    if (claimsJson.data.accounts.length > 0) {
        drawsClaimed = claimsJson.data.accounts[0].draws;
    }
    let claims = [];
    drawsClaimed.forEach((claim) => {
        let drawId = claim.id.split('-')[1];
        claims.push(drawId);
    });
    return claims;
}
export const GetClaimsHistory = async (address) => {
const variables = { address: address.toLowerCase() };
const params = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
};
try{
 let claims = await Promise.all(
        CLAIMSGRAPH.map(async (url) => {
            const resp = await fetch(url.URL, params);
            return resp;
        }),
    );
    const claimsData = await Promise.all(
        claims.map(async (r) => {
            return r.json();
        }),
    );let claimsReturn = {}
    claimsData.map((claims,index) => {let processed = processClaims(claims);claimsReturn[CLAIMSGRAPH[index].NETWORK] = processed});
   return claimsReturn
}catch(error){console.log("could not fetch claims");return null
}}

