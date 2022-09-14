
export const ABI = {
PRIZETIER : JSON.parse(
    '[{"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousManager","type":"address"},{"indexed":true,"internalType":"address","name":"newManager","type":"address"}],"name":"ManagerTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"pendingOwner","type":"address"}],"name":"OwnershipOffered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint32","name":"drawId","type":"uint32"},{"components":[{"internalType":"uint8","name":"bitRangeSize","type":"uint8"},{"internalType":"uint32","name":"drawId","type":"uint32"},{"internalType":"uint32","name":"maxPicksPerUser","type":"uint32"},{"internalType":"uint32","name":"expiryDuration","type":"uint32"},{"internalType":"uint32","name":"endTimestampOffset","type":"uint32"},{"internalType":"uint256","name":"prize","type":"uint256"},{"internalType":"uint32[16]","name":"tiers","type":"uint32[16]"}],"indexed":false,"internalType":"struct IPrizeTierHistory.PrizeTier","name":"prizeTier","type":"tuple"}],"name":"PrizeTierPushed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint32","name":"drawId","type":"uint32"},{"components":[{"internalType":"uint8","name":"bitRangeSize","type":"uint8"},{"internalType":"uint32","name":"drawId","type":"uint32"},{"internalType":"uint32","name":"maxPicksPerUser","type":"uint32"},{"internalType":"uint32","name":"expiryDuration","type":"uint32"},{"internalType":"uint32","name":"endTimestampOffset","type":"uint32"},{"internalType":"uint256","name":"prize","type":"uint256"},{"internalType":"uint32[16]","name":"tiers","type":"uint32[16]"}],"indexed":false,"internalType":"struct IPrizeTierHistory.PrizeTier","name":"prizeTier","type":"tuple"}],"name":"PrizeTierSet","type":"event"},{"inputs":[],"name":"claimOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"count","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getNewestDrawId","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOldestDrawId","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint32","name":"_drawId","type":"uint32"}],"name":"getPrizeTier","outputs":[{"components":[{"internalType":"uint8","name":"bitRangeSize","type":"uint8"},{"internalType":"uint32","name":"drawId","type":"uint32"},{"internalType":"uint32","name":"maxPicksPerUser","type":"uint32"},{"internalType":"uint32","name":"expiryDuration","type":"uint32"},{"internalType":"uint32","name":"endTimestampOffset","type":"uint32"},{"internalType":"uint256","name":"prize","type":"uint256"},{"internalType":"uint32[16]","name":"tiers","type":"uint32[16]"}],"internalType":"struct IPrizeTierHistory.PrizeTier","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getPrizeTierAtIndex","outputs":[{"components":[{"internalType":"uint8","name":"bitRangeSize","type":"uint8"},{"internalType":"uint32","name":"drawId","type":"uint32"},{"internalType":"uint32","name":"maxPicksPerUser","type":"uint32"},{"internalType":"uint32","name":"expiryDuration","type":"uint32"},{"internalType":"uint32","name":"endTimestampOffset","type":"uint32"},{"internalType":"uint256","name":"prize","type":"uint256"},{"internalType":"uint32[16]","name":"tiers","type":"uint32[16]"}],"internalType":"struct IPrizeTierHistory.PrizeTier","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint32[]","name":"_drawIds","type":"uint32[]"}],"name":"getPrizeTierList","outputs":[{"components":[{"internalType":"uint8","name":"bitRangeSize","type":"uint8"},{"internalType":"uint32","name":"drawId","type":"uint32"},{"internalType":"uint32","name":"maxPicksPerUser","type":"uint32"},{"internalType":"uint32","name":"expiryDuration","type":"uint32"},{"internalType":"uint32","name":"endTimestampOffset","type":"uint32"},{"internalType":"uint256","name":"prize","type":"uint256"},{"internalType":"uint32[16]","name":"tiers","type":"uint32[16]"}],"internalType":"struct IPrizeTierHistory.PrizeTier[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"manager","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pendingOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"uint8","name":"bitRangeSize","type":"uint8"},{"internalType":"uint32","name":"drawId","type":"uint32"},{"internalType":"uint32","name":"maxPicksPerUser","type":"uint32"},{"internalType":"uint32","name":"expiryDuration","type":"uint32"},{"internalType":"uint32","name":"endTimestampOffset","type":"uint32"},{"internalType":"uint256","name":"prize","type":"uint256"},{"internalType":"uint32[16]","name":"tiers","type":"uint32[16]"}],"internalType":"struct IPrizeTierHistory.PrizeTier","name":"_prizeTier","type":"tuple"}],"name":"popAndPush","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"uint8","name":"bitRangeSize","type":"uint8"},{"internalType":"uint32","name":"drawId","type":"uint32"},{"internalType":"uint32","name":"maxPicksPerUser","type":"uint32"},{"internalType":"uint32","name":"expiryDuration","type":"uint32"},{"internalType":"uint32","name":"endTimestampOffset","type":"uint32"},{"internalType":"uint256","name":"prize","type":"uint256"},{"internalType":"uint32[16]","name":"tiers","type":"uint32[16]"}],"internalType":"struct IPrizeTierHistory.PrizeTier","name":"_nextPrizeTier","type":"tuple"}],"name":"push","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"uint8","name":"bitRangeSize","type":"uint8"},{"internalType":"uint32","name":"drawId","type":"uint32"},{"internalType":"uint32","name":"maxPicksPerUser","type":"uint32"},{"internalType":"uint32","name":"expiryDuration","type":"uint32"},{"internalType":"uint32","name":"endTimestampOffset","type":"uint32"},{"internalType":"uint256","name":"prize","type":"uint256"},{"internalType":"uint32[16]","name":"tiers","type":"uint32[16]"}],"internalType":"struct IPrizeTierHistory.PrizeTier","name":"_prizeTier","type":"tuple"}],"name":"replace","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newManager","type":"address"}],"name":"setManager","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]'
  ),
  
TICKET : [
    "function balanceOf(address) public view returns (uint256)",
    "function totalSupply() public view returns (uint256)",
    "function getAverageBalanceBetween(address,uint64,uint64)  public view returns (uint256)",
    "function getBalanceAt(address user, uint64 timestamp) public view returns (uint256)",
    "function getTotalSupplyAt(uint64) public view returns (uint256)",
  ],
  AAVE : ["function balanceOf(address) public view returns (uint256)"],

  AAVEINCENTIVES : [
    "function getUserUnclaimedRewards(address) external view returns (uint256)",
  ],
  AAVEDATAV2: [
   "    function getReserveData(address asset) external view returns (uint256 availableLiquidity,uint256 totalStableDebt,uint256 totalVariableDebt,uint256 liquidityRate,uint256 variableBorrowRate,uint256 stableBorrowRate,uint256 averageStableBorrowRate,uint256 liquidityIndex,uint256 variableBorrowIndex,uint40 lastUpdateTimestamp)"
],
  AAVEDATA: [
    "function getReserveData(address asset) external view returns (uint256 unbacked,uint256 accruedToTreasuryScaled,uint256 totalAToken,uint256 totalStableDebt,uint256 totalVariableDebt,uint256 liquidityRate,uint256 variableBorrowRate,uint256 stableBorrowRate,uint256 averageStableBorrowRate,uint256 liquidityIndex,uint256 variableBorrowIndex,uint40 lastUpdateTimestamp)",
 ],
  AAVEINCENTIVESV3: [{"inputs":[{"internalType":"address","name":"emissionManager","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"asset","type":"address"},{"indexed":true,"internalType":"address","name":"reward","type":"address"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"assetIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"userIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"rewardsAccrued","type":"uint256"}],"name":"Accrued","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"asset","type":"address"},{"indexed":true,"internalType":"address","name":"reward","type":"address"},{"indexed":false,"internalType":"uint256","name":"oldEmission","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newEmission","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"oldDistributionEnd","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newDistributionEnd","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"assetIndex","type":"uint256"}],"name":"AssetConfigUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"claimer","type":"address"}],"name":"ClaimerSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"oldEmissionManager","type":"address"},{"indexed":true,"internalType":"address","name":"newEmissionManager","type":"address"}],"name":"EmissionManagerUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"reward","type":"address"},{"indexed":true,"internalType":"address","name":"rewardOracle","type":"address"}],"name":"RewardOracleUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"reward","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"address","name":"claimer","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"RewardsClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"reward","type":"address"},{"indexed":true,"internalType":"address","name":"transferStrategy","type":"address"}],"name":"TransferStrategyInstalled","type":"event"},{"inputs":[],"name":"REVISION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"assets","type":"address[]"},{"internalType":"address","name":"to","type":"address"}],"name":"claimAllRewards","outputs":[{"internalType":"address[]","name":"rewardsList","type":"address[]"},{"internalType":"uint256[]","name":"claimedAmounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"assets","type":"address[]"},{"internalType":"address","name":"user","type":"address"},{"internalType":"address","name":"to","type":"address"}],"name":"claimAllRewardsOnBehalf","outputs":[{"internalType":"address[]","name":"rewardsList","type":"address[]"},{"internalType":"uint256[]","name":"claimedAmounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"assets","type":"address[]"}],"name":"claimAllRewardsToSelf","outputs":[{"internalType":"address[]","name":"rewardsList","type":"address[]"},{"internalType":"uint256[]","name":"claimedAmounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"assets","type":"address[]"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"address","name":"reward","type":"address"}],"name":"claimRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"assets","type":"address[]"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"user","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"address","name":"reward","type":"address"}],"name":"claimRewardsOnBehalf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"assets","type":"address[]"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"reward","type":"address"}],"name":"claimRewardsToSelf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"uint88","name":"emissionPerSecond","type":"uint88"},{"internalType":"uint256","name":"totalSupply","type":"uint256"},{"internalType":"uint32","name":"distributionEnd","type":"uint32"},{"internalType":"address","name":"asset","type":"address"},{"internalType":"address","name":"reward","type":"address"},{"internalType":"contract ITransferStrategyBase","name":"transferStrategy","type":"address"},{"internalType":"contract IEACAggregatorProxy","name":"rewardOracle","type":"address"}],"internalType":"struct RewardsDataTypes.RewardsConfigInput[]","name":"config","type":"tuple[]"}],"name":"configureAssets","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"assets","type":"address[]"},{"internalType":"address","name":"user","type":"address"}],"name":"getAllUserRewards","outputs":[{"internalType":"address[]","name":"rewardsList","type":"address[]"},{"internalType":"uint256[]","name":"unclaimedAmounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"asset","type":"address"}],"name":"getAssetDecimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getClaimer","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"asset","type":"address"},{"internalType":"address","name":"reward","type":"address"}],"name":"getDistributionEnd","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getEmissionManager","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"reward","type":"address"}],"name":"getRewardOracle","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"asset","type":"address"}],"name":"getRewardsByAsset","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"asset","type":"address"},{"internalType":"address","name":"reward","type":"address"}],"name":"getRewardsData","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRewardsList","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"reward","type":"address"}],"name":"getTransferStrategy","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"address","name":"reward","type":"address"}],"name":"getUserAccruedRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"address","name":"asset","type":"address"},{"internalType":"address","name":"reward","type":"address"}],"name":"getUserAssetIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"assets","type":"address[]"},{"internalType":"address","name":"user","type":"address"},{"internalType":"address","name":"reward","type":"address"}],"name":"getUserRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"totalSupply","type":"uint256"},{"internalType":"uint256","name":"userBalance","type":"uint256"}],"name":"handleAction","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"emissionManager","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"address","name":"caller","type":"address"}],"name":"setClaimer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"asset","type":"address"},{"internalType":"address","name":"reward","type":"address"},{"internalType":"uint32","name":"newDistributionEnd","type":"uint32"}],"name":"setDistributionEnd","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"emissionManager","type":"address"}],"name":"setEmissionManager","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"asset","type":"address"},{"internalType":"address[]","name":"rewards","type":"address[]"},{"internalType":"uint88[]","name":"newEmissionsPerSecond","type":"uint88[]"}],"name":"setEmissionPerSecond","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"reward","type":"address"},{"internalType":"contract IEACAggregatorProxy","name":"rewardOracle","type":"address"}],"name":"setRewardOracle","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"reward","type":"address"},{"internalType":"contract ITransferStrategyBase","name":"transferStrategy","type":"address"}],"name":"setTransferStrategy","outputs":[],"stateMutability":"nonpayable","type":"function"}]

}
