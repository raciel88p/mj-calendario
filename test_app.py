#!/usr/bin/env python3
"""
Suite de Pruebas Verificación MJ Estética / MJ Calendario
"""

import unittest
import os
import json

class TestMJCalendario(unittest.TestCase):
    def test_readme_exists(self):
        self.assertTrue(os.path.exists("README.md"), "El archivo README.md debe existir")

    def test_readme_content(self):
        with open("README.md", "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("MJ Estética", content)
        self.assertIn("Clean Architecture", content)
        self.assertIn("Agenda", content)
        self.assertIn("WhatsApp", content)

    def test_package_json_if_exists(self):
        if os.path.exists("package.json"):
            with open("package.json", "r", encoding="utf-8") as f:
                data = json.load(f)
            self.assertIn("name", data)

if __name__ == "__main__":
    unittest.main()
