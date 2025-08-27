

function leaderboardCompare(a, b) {
  if (a.points !== b.points) return b.points - a.points; // desc points

  // Tie-breaker 1: more recent updatedAt first
  const aUpd = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
  const bUpd = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
  if (aUpd !== bUpd) return bUpd - aUpd;

  // Tie-breaker 2: earlier createdAt (loyalty)
  const aCr = a.createdAt ? new Date(a.createdAt).getTime() : 0;
  const bCr = b.createdAt ? new Date(b.createdAt).getTime() : 0;
  if (aCr !== bCr) return aCr - bCr;

  // Final fallback: ObjectId string compare
  return String(a._id).localeCompare(String(b._id));
}

// Stable Merge Sort
function mergeSort(arr, compareFn) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid), compareFn);
  const right = mergeSort(arr.slice(mid), compareFn);
  return merge(left, right, compareFn);
}
function merge(left, right, compareFn) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (compareFn(left[i], right[j]) <= 0) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  while (i < left.length) result.push(left[i++]);
  while (j < right.length) result.push(right[j++]);
  return result;
}
function rankUsers(users, limit = 10) {
  if (!Array.isArray(users) || users.length === 0) return [];
  const sorted = mergeSort(users, leaderboardCompare);
  return sorted.slice(0, limit);
}

module.exports = {
  rankUsers,
  mergeSort,
  leaderboardCompare
};
