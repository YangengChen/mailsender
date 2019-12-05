"""empty message

Revision ID: d0a2dc97cd37
Revises: dd7ca496f967
Create Date: 2019-12-05 12:48:58.738402

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd0a2dc97cd37'
down_revision = 'dd7ca496f967'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('email_templates', sa.Column('owner_id', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'email_templates', 'users', ['owner_id'], ['id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'email_templates', type_='foreignkey')
    op.drop_column('email_templates', 'owner_id')
    # ### end Alembic commands ###
