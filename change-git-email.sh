# Context: 
# need to write this script cause some of my previous commits' email is wrong 
# and Github contributions didn't recognize it

git filter-branch --env-filter '
OLD_EMAIL="adamzhang@futunn.com"
CORRECT_EMAIL="ztengc5@gmail.com"
CORRECT_NAME="tz-goat"

if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_COMMITTER_NAME="$CORRECT_NAME"
    export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
fi
if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_AUTHOR_NAME="$CORRECT_NAME"
    export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
fi
' --tag-name-filter cat -- --branches --tags 


# what is git filter-branch?


# git filter-branch is a Git command that rewrites Git history
# It can be used to:
# 1. Change commit author/committer information
# 2. Remove files from entire Git history
# 3. Move subdirectories to their own repositories
# 4. Make global changes across the entire repository history

# GitHub now recommends using git-filter-repo instead of git filter-branch as it's faster and more powerful