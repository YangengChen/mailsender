"""empty message

Revision ID: 8018d58b4daa
Revises: 
Create Date: 2019-12-06 20:12:14.849756

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8018d58b4daa'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('email_templates', sa.Column('date_created', sa.DateTime(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('email_templates', 'date_created')
    # ### end Alembic commands ###
