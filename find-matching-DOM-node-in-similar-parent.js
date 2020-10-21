/**
 * Given a DOM node C in a parent A, and a similarly structured parent B, find the matching DOM node in B

<ul class="first">  // A
  <li>
  <li>
    <ul>
      <li>
        <p>         // C
      <li>
      <li>

<ul class="second"> // B
  <li>
  <li>
    <ul>
      <li>
        <p>         // find this
      <li>
      <li>
 */

/**
 * Solution
 */
      
function find(A, B, node) {
  let currentNode = node;
  const path = [];

  while (currentNode.parentNode && currentNode.parentNode !== A) {
    path.push(currentNode.parentNode.indexOf(currentNode));
    currentNode = currentNode.parentNode;
  }

  let targetNode = B;
  for (let idx of path) {
    targetNode = targetNode.children[path];
  }

  return targetNode;
}
