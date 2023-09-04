import { Complexity, Question } from "../types/Question";

export const mockQuestions: Question[] = [
  {
    id: "1",
    categories: ["Strings"],
    title: "Reverse a string",
    complexity: Complexity.easy,
    description: `Write a function that reverses a string. The input string is given as an array of characters s.
You must do this by modifying the input array in-place with O(1) extra memory.

Example 1:
Input: s = ["h","e","l","l","o"] 
Output: ["o","l","l","e","h"] 

Example 2:  
Input: s = ["H","a","n","n","a","h"]  
Output: ["h","a","n","n","a","H"] 
 
Constraints: 
 
1 <= s.length <= 105
s[i] is a printable ascii character. 
`,
  },
  {
    id: "2",
    categories: ["Data Structures", "Algorithms"],
    title: "Linked List Cycle Detection ",
    complexity: Complexity.easy,
    description: `Given head, the head of a linked list, determine if the linked list has a cycle in it. There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer. Internally, pos is used to denote the index of the node that tail's next pointer is connected to. Note that pos is not passed as a parameter. 

Return true if there is a cycle in the linked list. Otherwise, return false.`,
  },
];
