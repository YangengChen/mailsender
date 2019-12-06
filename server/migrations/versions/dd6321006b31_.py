"""empty message

Revision ID: dd6321006b31
Revises: 
Create Date: 2019-12-05 16:22:12.657530

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'dd6321006b31'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('email_templates', sa.Column('owner_id', sa.Integer(), nullable=True))
    op.drop_constraint('email_templates_owner_fkey', 'email_templates', type_='foreignkey')
    op.create_foreign_key(None, 'email_templates', 'users', ['owner_id'], ['id'])
    op.drop_column('email_templates', 'owner')
    op.add_column('prospects', sa.Column('imported_from', sa.String(length=120), nullable=True))
    op.add_column('steps', sa.Column('email_template_id', sa.Integer(), nullable=True))
    op.drop_constraint('steps_template_id_fkey', 'steps', type_='foreignkey')
    op.create_foreign_key(None, 'steps', 'email_templates', ['email_template_id'], ['id'])
    op.drop_column('steps', 'template_id')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('steps', sa.Column('template_id', sa.INTEGER(), autoincrement=False, nullable=True))
    op.drop_constraint(None, 'steps', type_='foreignkey')
    op.create_foreign_key('steps_template_id_fkey', 'steps', 'email_templates', ['template_id'], ['id'])
    op.drop_column('steps', 'email_template_id')
    op.drop_column('prospects', 'imported_from')
    op.add_column('email_templates', sa.Column('owner', sa.INTEGER(), autoincrement=False, nullable=True))
    op.drop_constraint(None, 'email_templates', type_='foreignkey')
    op.create_foreign_key('email_templates_owner_fkey', 'email_templates', 'users', ['owner'], ['id'])
    op.drop_column('email_templates', 'owner_id')
    # ### end Alembic commands ###