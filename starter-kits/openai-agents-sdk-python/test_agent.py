import os
import unittest
import tempfile
import pathlib

# Mock environment before importing agent
os.environ["OPERATOR_APPROVED_TO_RUN"] = "1"
os.environ["OPENAI_API_KEY"] = "sk-test"

import agent

class TestSafePath(unittest.TestCase):
    def setUp(self):
        # Create a temporary directory to act as the sandbox
        self.test_dir = tempfile.TemporaryDirectory()
        self.sandbox_path = pathlib.Path(self.test_dir.name).resolve()

        # Patch the sandbox directory in the agent module
        self.original_sandbox = agent.SANDBOX_DIR
        agent.SANDBOX_DIR = self.sandbox_path

    def tearDown(self):
        # Restore original sandbox and cleanup
        agent.SANDBOX_DIR = self.original_sandbox
        self.test_dir.cleanup()

    def test_safe_path_valid_simple(self):
        """Test that a simple file inside the sandbox is allowed."""
        # Note: the file doesn't necessarily need to exist for _safe_path,
        # but the path resolution happens.
        path = "test.txt"
        expected = self.sandbox_path / path
        result = agent._safe_path(path)
        self.assertEqual(result, expected)

    def test_safe_path_valid_nested(self):
        """Test that a nested file inside the sandbox is allowed."""
        path = "nested/folder/test.txt"
        expected = self.sandbox_path / "nested" / "folder" / "test.txt"
        result = agent._safe_path(path)
        self.assertEqual(result, expected)

    def test_safe_path_directory_traversal(self):
        """Test that directory traversal outside the sandbox is blocked."""
        # Resolves to parent directory of sandbox
        path = "../outside.txt"
        with self.assertRaisesRegex(PermissionError, "resolves outside sandbox directory"):
            agent._safe_path(path)

    def test_safe_path_absolute_path_outside(self):
        """Test that an absolute path outside the sandbox is blocked."""
        # Assuming /tmp is outside our temp sandbox
        path = "/tmp/hacked.txt"
        with self.assertRaisesRegex(PermissionError, "resolves outside sandbox directory"):
            agent._safe_path(path)

    def test_safe_path_symlink_escape(self):
        """Test that symlinks resolving outside the sandbox are blocked."""
        # Create a symlink inside the sandbox pointing to an outside file
        outside_file = pathlib.Path(self.test_dir.name).parent / "escape.txt"
        outside_file.touch()

        try:
            symlink_path = self.sandbox_path / "symlink.txt"
            symlink_path.symlink_to(outside_file)

            # Use the relative path of the symlink
            with self.assertRaisesRegex(PermissionError, "resolves outside sandbox directory"):
                agent._safe_path("symlink.txt")
        finally:
            if outside_file.exists():
                outside_file.unlink()

class TestReadNotes(unittest.TestCase):
    def setUp(self):
        self.test_dir = tempfile.TemporaryDirectory()
        self.sandbox_path = pathlib.Path(self.test_dir.name).resolve()

        self.original_sandbox = agent.SANDBOX_DIR
        agent.SANDBOX_DIR = self.sandbox_path

    def tearDown(self):
        agent.SANDBOX_DIR = self.original_sandbox
        self.test_dir.cleanup()

    def test_read_notes_success(self):
        """Test reading an existing file inside the sandbox."""
        note_content = "This is a test note."
        note_path = self.sandbox_path / "note.txt"
        note_path.write_text(note_content, encoding="utf-8")

        result = agent._read_notes_impl("note.txt")
        self.assertEqual(result, note_content)

    def test_read_notes_file_not_found(self):
        """Test reading a non-existent file inside the sandbox."""
        with self.assertRaisesRegex(FileNotFoundError, "File not found in sandbox: missing.txt"):
            agent._read_notes_impl("missing.txt")

    def test_read_notes_is_directory(self):
        """Test reading a directory instead of a file inside the sandbox."""
        dir_path = self.sandbox_path / "folder"
        dir_path.mkdir()

        with self.assertRaisesRegex(FileNotFoundError, "File not found in sandbox: folder"):
            agent._read_notes_impl("folder")

    def test_read_notes_permission_error(self):
        """Test reading a file outside the sandbox."""
        with self.assertRaisesRegex(PermissionError, "resolves outside sandbox directory"):
            agent._read_notes_impl("../outside.txt")

if __name__ == '__main__':
    unittest.main()
