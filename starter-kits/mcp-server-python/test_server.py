import os
import sys
import unittest

# Set environment variable to bypass the server's safety gate during testing
os.environ["OPERATOR_APPROVED_TO_RUN"] = "1"

import server

class TestGreetFunction(unittest.TestCase):

    def test_greet_success(self):
        # Happy path
        self.assertEqual(server.greet("Alice"), "Hello, Alice! Welcome.")
        self.assertEqual(server.greet("Bob"), "Hello, Bob! Welcome.")

    def test_greet_strip_whitespace(self):
        # Tests that whitespace is stripped
        self.assertEqual(server.greet("  Charlie  "), "Hello, Charlie! Welcome.")

    def test_greet_empty_string(self):
        # Tests empty string rejection
        self.assertEqual(server.greet(""), "Error: name must be a non-empty string.")

    def test_greet_whitespace_only(self):
        # Tests that whitespace-only string is rejected
        self.assertEqual(server.greet("   "), "Error: name must be a non-empty string.")

    def test_greet_wrong_type(self):
        # Tests wrong type rejection
        self.assertEqual(server.greet(123), "Error: name must be a non-empty string.")
        self.assertEqual(server.greet(None), "Error: name must be a non-empty string.")

    def test_greet_length_limit(self):
        # Tests length limit rejection
        long_name = "a" * 101
        self.assertEqual(server.greet(long_name), "Error: name must be 100 characters or fewer.")
        exact_length_name = "a" * 100
        self.assertEqual(server.greet(exact_length_name), f"Hello, {exact_length_name}! Welcome.")

    def test_greet_forbidden_chars(self):
        # Tests injection/forbidden characters rejection
        forbidden = set('\n\r\x00;<>&|`$(){}[]')
        for char in forbidden:
            self.assertEqual(server.greet(f"test{char}name"), "Error: name contains invalid characters.")

if __name__ == "__main__":
    unittest.main()
