import os
import unittest
import tempfile
import pathlib
from unittest.mock import patch, MagicMock

# Set required environment variables for safe import
os.environ["OPERATOR_APPROVED_TO_RUN"] = "1"
os.environ["OPENAI_API_KEY"] = "sk-dummy"

# Import the script
from script import read_note_files, generate_summary, SYSTEM_PROMPT

class TestReadNoteFiles(unittest.TestCase):
    def setUp(self):
        # Create a temporary sandbox directory for testing
        self.temp_dir = tempfile.TemporaryDirectory()
        self.temp_sandbox = pathlib.Path(self.temp_dir.name).resolve()

        # We need to temporarily patch SANDBOX_DIR in the script module
        import script
        self.original_sandbox = script.SANDBOX_DIR
        script.SANDBOX_DIR = self.temp_sandbox

        self.notes_dir = self.temp_sandbox / "notes"
        self.notes_dir.mkdir()

    def tearDown(self):
        import script
        script.SANDBOX_DIR = self.original_sandbox
        self.temp_dir.cleanup()

    def test_read_happy_path(self):
        # Create valid notes
        file1 = self.notes_dir / "note1.txt"
        file1.write_text("Hello World", encoding="utf-8")
        file2 = self.notes_dir / "note2.md"
        file2.write_text("Markdown **bold**", encoding="utf-8")

        notes = [file1, file2]

        combined, warnings = read_note_files(notes)

        self.assertIn("--- note1.txt ---", combined)
        self.assertIn("Hello World", combined)
        self.assertIn("--- note2.md ---", combined)
        self.assertIn("Markdown **bold**", combined)
        self.assertEqual(len(warnings), 0)

    def test_permission_error_outside_sandbox(self):
        # Create a file outside the temporary sandbox
        with tempfile.NamedTemporaryFile(delete=False) as tf:
            tf.write(b"Outside data")
            outside_file = pathlib.Path(tf.name)

        try:
            combined, warnings = read_note_files([outside_file])

            self.assertEqual(combined, "")
            self.assertEqual(len(warnings), 1)
            self.assertIn("Attempted to read outside sandbox", warnings[0])
        finally:
            os.unlink(outside_file)

    def test_file_not_found(self):
        # Non-existent file in the sandbox
        non_existent = self.notes_dir / "does_not_exist.txt"

        combined, warnings = read_note_files([non_existent])

        self.assertEqual(combined, "")
        self.assertEqual(len(warnings), 1)
        # Check that it either skips or correctly errors out with a permission/file not found error
        self.assertTrue(
            "Skipped does_not_exist.txt" in warnings[0] or
            "File not found or invalid path" in warnings[0]
        )

    def test_empty_list(self):
        combined, warnings = read_note_files([])
        self.assertEqual(combined, "")
        self.assertEqual(warnings, [])


class TestGenerateSummary(unittest.TestCase):
    @patch('script.OpenAI')
    def test_generate_summary_success(self, mock_openai_class):
        # Setup mock client and response
        mock_client = MagicMock()
        mock_openai_class.return_value = mock_client

        mock_response = MagicMock()
        mock_choice = MagicMock()
        mock_choice.message.content = "This is a summary."
        mock_response.choices = [mock_choice]

        mock_client.chat.completions.create.return_value = mock_response

        # Call function
        user_message = "Here are my notes."
        model = "gpt-4o"
        api_key = "fake-key"
        result = generate_summary(user_message, model, api_key)

        # Assertions
        self.assertEqual(result, "This is a summary.")
        mock_openai_class.assert_called_once_with(api_key=api_key)
        mock_client.chat.completions.create.assert_called_once_with(
            model=model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message},
            ],
            max_tokens=1024,
        )

    @patch('script.OpenAI')
    def test_generate_summary_empty_response(self, mock_openai_class):
        # Setup mock client and response with empty content
        mock_client = MagicMock()
        mock_openai_class.return_value = mock_client

        mock_response = MagicMock()
        mock_choice = MagicMock()
        mock_choice.message.content = None
        mock_response.choices = [mock_choice]

        mock_client.chat.completions.create.return_value = mock_response

        # Call function
        result = generate_summary("notes", "model", "key")

        # Assertions
        self.assertEqual(result, "")

    @patch('script.OpenAI')
    def test_generate_summary_api_error(self, mock_openai_class):
        # Setup mock to raise an exception
        mock_client = MagicMock()
        mock_openai_class.return_value = mock_client
        mock_client.chat.completions.create.side_effect = Exception("API failure")

        # Call function and expect exception
        with self.assertRaises(Exception) as context:
            generate_summary("notes", "model", "key")

        self.assertTrue("API failure" in str(context.exception))

if __name__ == "__main__":
    unittest.main()
