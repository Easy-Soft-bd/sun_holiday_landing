# SSH Setup Guide (Mac + GitHub)

This guide summarizes the full process of setting up SSH keys and fixing common issues on macOS.

---

# 1. Generate SSH Key

Create a new SSH key:

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

When asked:

* Save file (optional custom name like `id_ssh_hira_mac`)
* Set passphrase (optional)

Example output location:

```
~/.ssh/id_ssh_hira_mac
```

---

# 2. Start SSH Agent

```bash
eval "$(ssh-agent -s)"
```

---

# 3. Add SSH Key to Agent

```bash
ssh-add ~/.ssh/id_ssh_hira_mac
```

Check loaded keys:

```bash
ssh-add -l
```

---

# 4. Copy Public Key

Use this command:

```bash
pbcopy < ~/.ssh/id_ssh_hira_mac.pub
```

---

# 5. Add Key to GitHub

1. Go to GitHub Settings
2. Open "SSH and GPG keys"
3. Click "New SSH key"
4. Paste the copied key
5. Save

---

# 6. Test SSH Connection

```bash
ssh -T git@github.com
```

Successful output:

```
Hi username! You've successfully authenticated...
```

---

# 7. Fix: SSH Key Not Persisting After Closing Terminal

If SSH stops working after closing terminal, fix it with Keychain support.

Edit SSH config:

```bash
nano ~/.ssh/config
```

Add:

```
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ssh_hira_mac
  AddKeysToAgent yes
  UseKeychain yes
```

Then run:

```bash
ssh-add --apple-use-keychain ~/.ssh/id_ssh_hira_mac
```

---

# 8. Fix: Permission Denied (publickey)

If you see:

```
Permission denied (publickey)
```

Check:

* SSH key is added to GitHub
* Correct key is loaded
* Run:

```bash
ssh-add ~/.ssh/id_ssh_hira_mac
```

Debug mode:

```bash
ssh -vT git@github.com
```

---

# 9. Important Notes

* SSH key = your identity (not per repo)
* Deploy keys are repo-specific
* Never run SSH key file directly

Wrong:

```bash
~/.ssh/id_ssh_hira_mac
```

---

# 10. Deploy Key (Optional Advanced)

Used for single repository access only.

Steps:

1. Generate new key
2. Add public key to repo settings → Deploy Keys
3. Enable write access if needed

---

# Done 🎯

You now have a full working SSH setup for Git + GitHub on macOS.
